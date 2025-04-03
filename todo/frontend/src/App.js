import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { SERVER_API, SERVER_URL } from './serverData';

// const SERVER_API = process.env.REACT_APP_SERVER_API;
// const SERVER_API = 'http://localhost:8000';
// const SERVER_API = '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${SERVER_API}/todos`);
      setTodos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch todos');
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(`${SERVER_API}/todos`, { title: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${SERVER_API}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <h1 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
        <img style={{width: '60px'}} src={`${SERVER_URL}/to-do-list.png`} alt="logo" />
        <span> Todo List </span>
      </h1>

      {/* Add Todo Form */}
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button type="submit">Add Todo</button>
      </form>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title} {todo.completed ? '(Completed)' : ''}</span>
            <span className="created-at">Created: {new Date(todo.created_at).toLocaleString()}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;