import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// CORS Middleware Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend URL
  methods: ['GET', 'POST'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type'] // Specify allowed headers
}));

// Middleware to parse JSON
app.use(express.json());

// Test API endpoint
app.get('/api/message', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the backend!' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/api/generate-task', (req: Request, res: Response) => {
    console.log('Kapott adatok:', req.body); // Log received data
    const { taskType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date } = req.body;

    // Example processing
    const response = {
        message: "Feladat sikeresen létrehozva!",
        receivedData: req.body,
    };

    res.json(response); // Send response back to frontend
});
