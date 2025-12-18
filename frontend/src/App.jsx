import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000';

function Modal({ isModalOpen, todoForm, setTodoForm, setIsModalOpen, createTodo }) {
  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todoForm.title.trim()) return;
    createTodo(e);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTodoForm({ title: '', description: '' });
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Todo</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            value={todoForm.title}
            onChange={(e) => setTodoForm({...todoForm, title: e.target.value})}
            placeholder="Todo title..."
            className="modal-input"
            autoFocus
          />
          <textarea
            value={todoForm.description}
            onChange={(e) => setTodoForm({...todoForm, description: e.target.value})}
            placeholder="Description (optional)..."
            className="modal-textarea"
            rows="4"
          />
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoForm, setTodoForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (!todoForm.title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: todoForm.title,
          description: todoForm.description
        }),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTodoForm({ title: '', description: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const toggleTodo = async (id, done) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const todoItems = todos.filter(todo => !todo.done);
  const doneItems = todos.filter(todo => todo.done);

  return (
    <div className="app">
      <h1>Todo List</h1>

      <Modal
        isModalOpen={isModalOpen}
        todoForm={todoForm}
        setTodoForm={setTodoForm}
        setIsModalOpen={setIsModalOpen}
        createTodo={createTodo}
      />

      <div className="add-todo-section">
        <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
          + Add New Todo
        </button>
      </div>

      <div className="columns">
        <div className="column">
          <h2>To Do ({todoItems.length})</h2>
          <div className="todo-list">
            {todoItems.map(todo => (
              <div key={todo.id} className="todo-item">
                <span>{todo.title}</span>
                <button onClick={() => toggleTodo(todo.id, true)} className="done-button">
                  Mark Done
                </button>
              </div>
            ))}
            {todoItems.length === 0 && <p className="empty-message">No todos yet!</p>}
          </div>
        </div>

        <div className="column">
          <h2>Done ({doneItems.length})</h2>
          <div className="todo-list">
            {doneItems.map(todo => (
              <div key={todo.id} className="todo-item done">
                <span>{todo.title}</span>
                <button onClick={() => toggleTodo(todo.id, false)} className="undo-button">
                  Undo
                </button>
              </div>
            ))}
            {doneItems.length === 0 && <p className="empty-message">No completed todos!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
