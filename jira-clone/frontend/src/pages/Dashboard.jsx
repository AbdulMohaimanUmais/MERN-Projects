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
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2">
          <input
            type="text" placeholder="Project name" required
            className="border p-2 rounded flex-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text" placeholder="Description"
            className="border p-2 rounded flex-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Add</button>
        </form>

        <div className="grid gap-3">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div className="cursor-pointer" onClick={() => navigate(`/project/${p._id}`)}>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.description}</p>
              </div>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}