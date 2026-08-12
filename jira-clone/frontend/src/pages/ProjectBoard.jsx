import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import { getTasksByProject, createTask, updateTask, deleteTask } from '../api/tasks';
import socket from '../socket';

const COLUMNS = [
  { key: 'todo', label: 'To Do' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
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
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2">
          <input
            type="text" placeholder="New task title" required
            className="border p-2 rounded flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Add Task</button>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map((col) => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 rounded p-3 min-h-[300px]"
                  >
                    <h3 className="font-semibold mb-3">{col.label}</h3>
                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-3 rounded shadow mb-2 cursor-pointer"
                              onClick={() => setSelectedTask(task)}
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium">{task.title}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                                  className="text-red-400 text-xs ml-2"
                                >
                                  x
                                </button>
                              </div>
                              {task.assignee && (
                                <p className="text-xs text-gray-400 mt-1">{task.assignee.name}</p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
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