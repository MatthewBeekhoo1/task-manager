import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API = "https://task-manager-backend-1fjt.onrender.com/";

  const headers = {
    headers: { Authorization: token }
  };

  const getTasks = async () => {
    if (!token) return;
    const res = await axios.get(`${API}/tasks`, headers);
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, [token]);

  const register = async () => {
    await axios.post(`${API}/auth/register`, { email, password });
    alert("Registered. Now login.");
  };

  const login = async () => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post(`${API}/tasks`, { title }, headers);
    setTitle("");
    getTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`, headers);
    getTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(
      `${API}/tasks/${task._id}`,
      { completed: !task.completed },
      headers
    );
    getTasks();
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-xl mb-4">Login / Register</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-2"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white w-full mb-2 p-2"
            onClick={login}
          >
            Login
          </button>

          <button
            className="bg-gray-500 text-white w-full p-2"
            onClick={register}
          >
            Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl mb-4">Task Manager</h1>

        <input
          className="border p-2 w-full mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full mb-4 p-2"
          onClick={addTask}
        >
          Add Task
        </button>

        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between mb-2">
              <span
                onClick={() => toggleTask(task)}
                className={task.completed ? "line-through" : ""}
              >
                {task.title}
              </span>

              <button onClick={() => deleteTask(task._id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;