import { DataModel } from "../models/taskModel";

export const validateSvgInput = (task: DataModel): string | null => {
  if (!task.graphNodes || typeof task.graphNodes !== "number") return "A gráf csúcsainak száma nem megfelelő.";
  if (!task.graphEdges || typeof task.graphEdges !== "number") return "A gráf éleinek száma nem megfelelő.";
  return null;
};

export const validatePdfInput = (task: DataModel): string | null => {
  if (!task.taskTitle || typeof task.taskTitle !== "string") return "A feladat címe nem megfelelő.";
  if (!task.taskText || typeof task.taskText !== "string") return "A feladat szövege nem megfelelő.";
  if (task.dateChecked) {
    if (!task.date || isNaN(Date.parse(task.date))) {
      return "A dátum formátuma nem megfelelő.";
    }
  }

  return null;
};
