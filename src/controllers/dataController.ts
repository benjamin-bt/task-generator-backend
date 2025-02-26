import { Request, Response } from "express";
import { processPdfTask } from "../services/processPdfTask";
import { processSvgTask } from "../services/processSvgTask";
import { validatePdfInput, validateSvgInput } from "../utils/validationUtils";
import * as fs from "fs";
import * as path from "path";


const MAX_FILES = 10;
const SVG_DIRECTORY = path.join(__dirname, "../../generated_svg");
const PDF_TASK_DIRECTORY = path.join(__dirname, "../../generated_task_pdf");
const PDF_SOLUTION_DIRECTORY = path.join(__dirname, "../../generated_solution_pdf");

let svgFilePath: string | undefined;

const getSvgFiles = (): string[] => {
  return fs
    .readdirSync(SVG_DIRECTORY)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => path.join(SVG_DIRECTORY, file));
};

const manageSvgFiles = () => {
  const svgFiles = getSvgFiles();
  if (svgFiles.length > MAX_FILES) {
    const filesToDelete = svgFiles
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
      .slice(0, svgFiles.length - MAX_FILES);
    filesToDelete.forEach((file) => fs.unlinkSync(file));
  }
};

const getTaskPdfFiles = (): string[] => {
  return fs
    .readdirSync(PDF_TASK_DIRECTORY)
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => path.join(PDF_TASK_DIRECTORY, file));
};

const manageTaskPdfFiles = () => {
  const pdfFiles = getTaskPdfFiles();
  if (pdfFiles.length > MAX_FILES) {
    const filesToDelete = pdfFiles
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
      .slice(0, pdfFiles.length - MAX_FILES);
    filesToDelete.forEach((file) => fs.unlinkSync(file));
  }
};

const getSolutionPdfFiles = (): string[] => {
  return fs
    .readdirSync(PDF_SOLUTION_DIRECTORY)
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => path.join(PDF_SOLUTION_DIRECTORY, file));
};

const manageSolutionPdfFiles = () => {
  const pdfFiles = getSolutionPdfFiles();
  if (pdfFiles.length > MAX_FILES) {
    const filesToDelete = pdfFiles
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
      .slice(0, pdfFiles.length - MAX_FILES);
    filesToDelete.forEach((file) => fs.unlinkSync(file));
  }
};

// SVG generálása
export const generateSvg = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validationError = validateSvgInput(req.body);
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    const { taskType, graphType, graphNodes, graphEdges, acyclicGraph } = req.body;

    const svgResult = await processSvgTask(taskType, graphType, graphNodes, graphEdges, acyclicGraph);

    /* console.log("SVG fájl generálás eredménye:", svgResult); */

    if (svgResult.success && svgResult.task) {
      const { svgFilePath, nodeList } = svgResult.task;
      manageSvgFiles();

      const filename = path.basename(svgFilePath);
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("X-Filename", filename);
      res.setHeader("X-Node-List", JSON.stringify(nodeList));
      res.setHeader("Access-Control-Expose-Headers", "X-Filename, X-Node-List");
      res.status(200).sendFile(path.resolve(svgFilePath));

    } else {
      res
        .status(500)
        .json({ success: false, message: "Hiba az SVG fájl generálásakor" });
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

    const { taskType, graphType, nodeListBack, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date, svgFilename } = req.body;

    manageTaskPdfFiles();
    manageSolutionPdfFiles();

    if (!svgFilename) {
      res.status(400).json({ success: false, message: "Hiányzik az SVG fájl neve." });
      return;
    }

    const svgFilePath = path.join(SVG_DIRECTORY, svgFilename);

    if (!fs.existsSync(svgFilePath)) {
      res.status(400).json({ success: false, message: "Az SVG fájl nem létezik." });
      return;
    }

    const pdfResult = await processPdfTask(
      taskType, 
      graphType,
      nodeListBack,
      graphNodes,
      graphEdges,
      taskTitle,
      taskText,
      dateChecked,
      date ? new Date(date) : null,
      svgFilePath,
    );

    const pdfTaskFilename = svgFilename.replace('.svg', '.pdf');
    const pdfSolutionFilename = svgFilename.replace('.svg', '_megoldas.pdf');
    const pdfTaskFilePath = path.join(PDF_TASK_DIRECTORY, pdfTaskFilename);
    const pdfSolutionFilePath = path.join(PDF_SOLUTION_DIRECTORY, pdfSolutionFilename);

    if (!fs.existsSync(pdfTaskFilePath) || !fs.existsSync(pdfSolutionFilePath)) {
      res.status(500).json({ success: false, message: "Nem sikerült a PDF generálása." });
      return;
    }

    res.status(200).json({
      success: true,
      taskPdf: `/generated_task_pdf/${pdfTaskFilename}`,
      solutionPdf: `/generated_solution_pdf/${pdfSolutionFilename}`
    });

  } catch (error) {
    console.error("Szerver oldali hiba:", error);
    res.status(500).json({ success: false, message: "Szerver oldali hiba" });
  }
};