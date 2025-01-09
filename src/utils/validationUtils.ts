import { DataModel } from "../models/taskModel";

export const validateTaskInput = (task: DataModel): string | null => {
  if (!task.taskType) return "Task type is required.";
  if (!task.graphNodes || typeof task.graphNodes !== "number") return "Graph nodes must be a number.";
  if (!task.graphEdges || typeof task.graphEdges !== "number") return "Graph edges must be a number.";
  if (!task.taskTitle || typeof task.taskTitle !== "string") return "Task title must be a string.";
  if (!task.taskText || typeof task.taskText !== "string") return "Task text must be a string.";
  if (typeof task.dateChecked !== "boolean") return "DateChecked must be a boolean.";
  if (task.dateChecked) {
    if (!task.date || isNaN(Date.parse(task.date))) {
      return "Date must be a valid ISO string or date.";
    }
  }

  return null; // Érvényes adatok esetén nincs hiba
};