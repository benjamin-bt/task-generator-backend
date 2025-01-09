import { Request, Response } from "express";
import { processTask } from "../services/taskService";
import { validateTaskInput } from "../utils/validationUtils";

export const generateTask = (req: Request, res: Response): void => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      // If validation fails, send a 400 response with the validation error message
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { taskType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date } = req.body;

    const taskResult = processTask(
      taskType,
      graphNodes,
      graphEdges,
      taskTitle,
      taskText,
      dateChecked,
      date
    );

    // A feldolgozás eredményének visszaadása
    res.status(200).json(taskResult);
  } catch (error) {
    console.error("Error processing task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
