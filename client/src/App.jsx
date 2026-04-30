import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [error, setError] = useState("");

  const API = "https://task-manager-backend-1fjt.onrender.com";

  const headers = {
    headers: { Authorization: token }
  };

  const getTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API}/api/tasks`, headers);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  useEffect(() => {
    getTasks();
  }, [token]);

  const register = async () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }
      await axios.post(`${API}/api/auth/register`, { email, password });
      setError("");
      setEmail("");
      setPassword("");
      alert("Registered successfully! Now login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const addTask = async () => {
    try {
      setError("");
      if (!title) {
        setError("Please enter a task");
        return;
      }
      await axios.post(`${API}/api/tasks`, { title }, headers);
      setTitle("");
      getTasks();
    } catch (err) {
      setError("Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      await axios.delete(`${API}/api/tasks/${id}`, headers);
      getTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");
      await axios.put(
        `${API}/api/tasks/${task._id}`,
        { completed: !task.completed },
        headers
      );
      getTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
    setError("");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-xl mb-4 font-bold">Login / Register</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <input
            className="border p-2 w-full mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-500 text-white w-full mb-2 p-2 hover:bg-blue-600"
            onClick={login}
          >
            Login
          </button>

          <button
            className="bg-gray-500 text-white w-full p-2 hover:bg-gray-600"
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Task Manager</h1>
          <button
            className="text-sm text-red-500 hover:text-red-700"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          className="border p-2 w-full mb-2"
          value={title}
          placeholder="New task..."
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white w-full mb-4 p-2 hover:bg-blue-600"
          onClick={addTask}
        >
          Add Task
        </button>

        {tasks.length === 0 ? (
          <p className="text-gray-400 text-center">No tasks yet</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
                <span
                  onClick={() => toggleTask(task)}
                  className={`cursor-pointer flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}
                >
                  {task.title}
                </span>

                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 ml-2 hover:text-red-700"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;