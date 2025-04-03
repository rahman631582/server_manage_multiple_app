import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import TaskDetails from './TaskDetails';
import { SERVER_API } from './serverData';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get(`${SERVER_API}/tasks`);
    setTasks(response.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    await axios.post(`${SERVER_API}/tasks`, { title: newTask });
    setNewTask('');
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${SERVER_API}/tasks/${id}`);
    fetchTasks();
  };

  const handleTaskClick = (id) => {
    navigate(`/task/${id}`);
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      
      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li 
            key={task._id}
            onClick={() => handleTaskClick(task._id)}
            className="task-item"
          >
            {task.title}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevents navigation when clicking delete
                deleteTask(task._id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router basename="/task">
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/task/:id" element={<TaskDetails />} />
      </Routes>
    </Router>
  );
}

export default App;