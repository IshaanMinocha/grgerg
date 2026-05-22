import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({
    quiet: true
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let todos = [];
let currentId = 1;

app.get('/health', (req, res) => {
    res.json({
        "status": true,
        "message": "running correctly in docker v5"
    });
});

// Create a new Todo
app.post('/todos', (req, res) => {
    const { title, completed = false } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTodo = {
        id: currentId++,
        title,
        completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Get all Todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Get a single Todo by ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
});

// Update a Todo
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = {
        ...todos[todoIndex],
        title: title !== undefined ? title : todos[todoIndex].title,
        completed: completed !== undefined ? completed : todos[todoIndex].completed
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
});

// Delete a Todo
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(204).send();
});

const port = process.env.PORT || 3000;

const isNodeEnvDevelopment = process.env.NODE_ENV === 'development';

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    if (isNodeEnvDevelopment) {
        console.log('Running in development mode');
    } else {
        console.log('Running in production mode');
    }
});
