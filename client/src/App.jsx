import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API = "http://localhost:5000/api/tasks";

  const getTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;
    await axios.post(API, { title });
    setTitle("");
    getTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    getTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/${task._id}`, {
      completed: !task.completed,
    });
    getTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Task Manager
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task"
          />
          <button
            className="bg-blue-500 text-white px-4 rounded"
            onClick={addTask}
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <span
                onClick={() => toggleTask(task)}
                className={`cursor-pointer ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;