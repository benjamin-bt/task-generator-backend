import { Request, Response } from "express";
import { processPdfTask } from "../services/processPDFTask";
import { processSvgTask } from "../services/processSVGTask";
import { validatePdfInput, validateSvgInput } from "../utils/validationUtils";
import * as fs from "fs";
import * as path from "path";

const MAX_SVG_FILES = 10;
const SVG_DIRECTORY = path.join(__dirname, "../../generated_svg");

let svgFilePath: string | undefined;

const getSvgFiles = (): string[] => {
  return fs.readdirSync(SVG_DIRECTORY)
    .filter(file => file.endsWith(".svg"))
    .map(file => path.join(SVG_DIRECTORY, file));
};

const manageSvgFiles = () => {
  const svgFiles = getSvgFiles();
  console.log(`${svgFiles.length} db SVG fájl van.`);
  if (svgFiles.length > MAX_SVG_FILES) {
    const filesToDelete = svgFiles.sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs).slice(0, svgFiles.length - MAX_SVG_FILES);
    console.log(`${filesToDelete.length} db SVG fájl törlése:`, filesToDelete);
    filesToDelete.forEach(file => fs.unlinkSync(file));
  }
};

export const generateSvg = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validateSvgInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { graphNodes, graphEdges } = req.body;

    const svgResult = await processSvgTask(graphNodes, graphEdges);

    if (svgResult.success && svgResult.task) {
      svgFilePath = svgResult.task.svgFilePath;
      manageSvgFiles();

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Content-Disposition", `attachment; filename="graph.svg"`);
      const svgStream = fs.createReadStream(svgFilePath);
      svgStream.pipe(res);

      console.log("SVG fájl legenerálva:", svgResult);
    } else {
      res.status(500).json({ success: false, message: "Hiba az SVG fájl generálásakor" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Szerver oldali hiba" });
  }
};

// PDF generálása
export const generatePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationError = validatePdfInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { taskType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date } = req.body;

    if (!svgFilePath) {
      res.status(400).json({ success: false, message: "Hiányzik az SVG fájl." });
      return;
    }

    // Az adatok feldolgozása a PDF generálásához
    const pdfResult = await processPdfTask(
      taskType,
      graphNodes,
      graphEdges,
      taskTitle,
      taskText,
      dateChecked,
      date ? new Date(date) : null,
      svgFilePath
    );

    const pdfFilePath = "./generated_pdf/generated_task.pdf";

    if (!fs.existsSync(pdfFilePath)) {
      res.status(500).json({ success: false, message: "Nem sikerült a PDF generálása." });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${taskTitle.replace(/\s/g, "_")}.pdf"`);

    const pdfStream = fs.createReadStream(pdfFilePath);
    pdfStream.pipe(res);

    console.log("PDF fájl létrehozva:", pdfResult);
  } catch (error) {
    console.error("Hiba az adatok feldolgozásakor:", error);
    res.status(500).json({ success: false, message: "Szerver oldali hiba" });
  }
};
