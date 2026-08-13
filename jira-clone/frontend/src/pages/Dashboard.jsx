import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProjects, createProject, deleteProject } from '../api/projects';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const { data } = await getProjects();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject({ name, description });
    setName('');
    setDescription('');
    fetchProjects();
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Your projects</h1>
            <p className="text-sm text-slate-500 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-lg p-4 mb-8 flex gap-3">
          <input
            type="text" placeholder="Project name" required
            className="border border-slate-200 rounded-md px-3 py-2 text-sm flex-1 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text" placeholder="Description (optional)"
            className="border border-slate-200 rounded-md px-3 py-2 text-sm flex-1 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 rounded-md transition-colors">
            Add
          </button>
        </form>

        {projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-lg">
            <p className="text-sm text-slate-400">No projects yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {projects.map((p) => (
              <div
                key={p._id}
                className="group bg-white border border-slate-200 rounded-lg px-4 py-3.5 flex justify-between items-center hover:border-slate-300 transition-colors"
              >
                <div className="cursor-pointer flex-1" onClick={() => navigate(`/project/${p._id}`)}>
                  <h3 className="text-sm font-medium text-slate-800">{p.name}</h3>
                  {p.description && <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-xs text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}