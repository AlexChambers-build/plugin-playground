# Todo List Application

A full-stack todo list application with a NestJS backend and React frontend.

## Features

- Create new todos
- Mark todos as done
- Undo completed todos
- Two-column layout (To Do and Done)
- Data persisted in JSON files
- Beautiful, responsive UI

## Project Structure

```
.
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── todos/   # Todo module (controller, service, interface)
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── data/        # JSON data storage (created automatically)
│
└── frontend/        # Vite + React frontend
    └── src/
        ├── App.jsx
        └── App.css
```

## Getting Started

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the backend server:
```bash
npm start
```

The backend will run on http://localhost:3000

### Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo (body: { title: string })
- `PATCH /todos/:id` - Update todo status (body: { done: boolean })

## How to Use

1. Start both the backend and frontend servers
2. Open your browser to http://localhost:5173
3. Add new todos using the input field
4. Click "Mark Done" to move todos to the Done column
5. Click "Undo" to move todos back to the To Do column

## Data Storage

Todos are stored in `backend/data/todos.json` and persist between server restarts.
