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
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[85vh] overflow-y-auto border border-slate-200">
        <div className="flex justify-between items-start px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-base leading-snug pr-4">{task.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">Assignee</label>
          <select
            value={assignee}
            onChange={handleAssign}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow bg-white"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>

          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
            Comments {comments.length > 0 && `(${comments.length})`}
          </label>

          <div className="mb-3 space-y-2 max-h-52 overflow-y-auto">
            {comments.length === 0 && (
              <p className="text-sm text-slate-400 py-2">No comments yet</p>
            )}
            {comments.map((c) => (
              <div key={c._id} className="bg-slate-50 border border-slate-100 rounded-md px-3 py-2">
                <p className="text-xs font-medium text-slate-600 mb-0.5">{c.user?.name || 'User'}</p>
                <p className="text-sm text-slate-700">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 rounded-md transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}