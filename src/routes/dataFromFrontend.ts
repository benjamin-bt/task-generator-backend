import express from "express";
import { generateTask } from "../controllers/dataController";

const router = express.Router();

router.post('/generate-task', generateTask);

export default router;