import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TaskDetails.css';
import { SERVER_API } from './serverData';


function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${SERVER_API}/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-details">
      <h2>Task Details</h2>
      <div className="task-content">
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}</p>
      </div>
      <Link to="/" className="back-link">Back to Tasks</Link>
    </div>
  );
}

export default TaskDetails;