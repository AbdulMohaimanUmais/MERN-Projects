import { useState, useEffect } from 'react';
import { updateTask } from '../api/tasks';
import api from '../api/axios';
import { getUsers } from '../api/auth';
import socket from '../socket';

export default function TaskModal({ task, onClose, onUpdated }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  const [users, setUsers] = useState([]);
  const [assignee, setAssignee] = useState(task.assignee?._id || '');

  useEffect(() => {
    getUsers().then(({ data }) => setUsers(data));

    const handleComment = ({ taskId, comments }) => {
      if (taskId === task._id) setComments(comments);
    };
    socket.on('task:comment', handleComment);
    return () => socket.off('task:comment', handleComment);
  }, [task._id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await api.post(`/tasks/${task._id}/comments`, { text: comment });
    setComment('');
  };

  const handleAssign = async (e) => {
    const userId = e.target.value;
    setAssignee(userId);
    await updateTask(task._id, { assignee: userId || null });
    onUpdated();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{task.title}</h3>
          <button onClick={onClose} className="text-gray-400">✕</button>
        </div>

        <label className="text-sm font-medium">Assignee</label>
        <select
          value={assignee}
          onChange={handleAssign}
          className="w-full border p-2 rounded mb-4 mt-1"
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>{u.name}</option>
          ))}
        </select>

        <label className="text-sm font-medium">Comments</label>
        <div className="mt-1 mb-2 max-h-40 overflow-y-auto space-y-2">
          {comments.map((c) => (
            <div key={c._id} className="bg-gray-100 p-2 rounded text-sm">
              <span className="font-medium">{c.user?.name || 'User'}: </span>
              {c.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add comment"
            className="flex-1 border p-2 rounded text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleAddComment} className="bg-blue-600 text-white px-3 rounded text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}