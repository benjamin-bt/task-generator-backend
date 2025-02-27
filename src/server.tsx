import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from "body-parser";
import generateTaskRoutes from "./routes/dataFromFrontend";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
  /* origin: 'http://localhost:3000', */
  /* origin: 'https://graph-task-generator.app', */
  origin: `${process.env.FRONTEND_URL}`,
  methods: ['GET', 'POST'], // Az engedélyezett HTTP metódusok
  allowedHeaders: ['Content-Type'] // Az engedélyezett HTTP fejlécek
}));

app.use(bodyParser.json());

app.use(express.json());

app.use(errorHandler);

app.use('/generated_task_pdf', express.static(path.join(__dirname, '../generated_task_pdf')));
app.use('/generated_solution_pdf', express.static(path.join(__dirname, '../generated_solution_pdf')));
app.use('/generated_svg', express.static(path.join(__dirname, '../generated_svg')));

// API végpont tesztelése
app.get('/api/message', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the backend!' });
});

app.use('/api', generateTaskRoutes);

// Szerver indítása
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
