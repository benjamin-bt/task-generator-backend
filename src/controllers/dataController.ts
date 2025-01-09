import { Request, Response } from "express";
import { processTask } from "../services/taskService";
import { validateTaskInput } from "../utils/validationUtils";
import * as fs from "fs";

export const generateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateTaskInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { taskType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date } = req.body;

    // A feladat feldolgozása és a PDF generálása
    const taskResult = await processTask(
      taskType,
      graphNodes,
      graphEdges,
      taskTitle,
      taskText,
      dateChecked,
      date ? new Date(date) : null
    );

    const pdfFilePath = "./generated_pdf/generated_task.pdf";

    // A PDF fájl ellenőrzése
    if (!fs.existsSync(pdfFilePath)) {
      res.status(500).json({ success: false, message: "A PDF fájl generálása sikertelen volt." });
      return;
    }

    // A PDF fájl visszaküldése
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${taskTitle.replace(/\s/g, "_")}.pdf"`);

    const pdfStream = fs.createReadStream(pdfFilePath);
    pdfStream.pipe(res);

    // A feldolgozás részletes logolása
    console.log("A feladat feldolgozása sikeres volt:", taskResult);
  } catch (error) {
    console.error("Hiba a feladat feldolgozásakor:", error);
    res.status(500).json({ success: false, message: "Szerverhiba" });
  }
};
