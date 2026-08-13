import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import { getTasksByProject, createTask, updateTask, deleteTask } from '../api/tasks';
import socket from '../socket';

const COLUMNS = [
  { key: 'todo', label: 'To Do', dot: 'bg-slate-400' },
  { key: 'in-progress', label: 'In Progress', dot: 'bg-amber-500' },
  { key: 'done', label: 'Done', dot: 'bg-emerald-500' },
];

export default function ProjectBoard() {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    const { data } = await getTasksByProject(projectId);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();

    socket.on('task:created', fetchTasks);
    socket.on('task:updated', fetchTasks);
    socket.on('task:deleted', fetchTasks);

    return () => {
      socket.off('task:created', fetchTasks);
      socket.off('task:updated', fetchTasks);
      socket.off('task:deleted', fetchTasks);
    };
  }, [projectId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title, project: projectId });
    setTitle('');
    fetchTasks();
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    fetchTasks();
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    await updateTask(draggableId, { status: newStatus, order: destination.index });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-lg p-3 mb-6 flex gap-2">
          <input
            type="text" placeholder="Add a task..." required
            className="border border-slate-200 rounded-md px-3 py-2 text-sm flex-1 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 rounded-md transition-colors">
            Add Task
          </button>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key);
              return (
                <Droppable droppableId={col.key} key={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg p-3 min-h-[400px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/50' : 'bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{col.label}</h3>
                        <span className="text-xs text-slate-400 ml-auto">{colTasks.length}</span>
                      </div>

                      {colTasks.map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`bg-white border border-slate-200 rounded-md p-3 mb-2 cursor-pointer transition-shadow ${
                                snapshot.isDragging ? 'shadow-md ring-1 ring-indigo-200' : 'hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-sm text-slate-800 leading-snug">{task.title}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                                  className="text-slate-300 hover:text-red-500 text-xs shrink-0 transition-colors"
                                >
                                  ✕
                                </button>
                              </div>

                              <div className="flex items-center justify-between mt-2.5">
                                {task.assignee ? (
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-medium flex items-center justify-center">
                                      {task.assignee.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-xs text-slate-400">{task.assignee.name}</span>
                                  </div>
                                ) : <span />}
                                {task.comments?.length > 0 && (
                                  <span className="text-xs text-slate-400">{task.comments.length} 💬</span>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {colTasks.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-6">No tasks</p>
                      )}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdated={fetchTasks}
          />
        )}
      </div>
    </div>
  );
}