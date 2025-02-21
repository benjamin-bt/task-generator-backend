import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import generateTaskRoutes from "./routes/dataFromFrontend";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({
  /* origin: 'http://localhost:3000', */ 
  origin: 'https://graph-task-generator.app/', // A frontend URL
  methods: ['GET', 'POST'], // Az engedélyezett HTTP metódusok
  allowedHeaders: ['Content-Type'] // Az engedélyezett HTTP fejlécek
}));

app.use(bodyParser.json());

app.use(express.json());

app.use(errorHandler);

// API végpont tesztelése
app.get('/api/message', (req: Request, res: Response) => {
    res.json({ message: 'Hello from the backend!' });
});

app.use('/api', generateTaskRoutes);

// Szerver indítása
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    /* console.log(`Server running at http://localhost:${PORT}`); */
    console.log(`Server running!`);
});
