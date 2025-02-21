import { Request, Response } from "express";
import { processPdfTask } from "../services/processPdfTask";
import { processSvgTask } from "../services/processSvgTask";
import { validatePdfInput, validateSvgInput } from "../utils/validationUtils";
import * as fs from "fs";
import * as path from "path";

const MAX_SVG_FILES = 10;
const SVG_DIRECTORY = path.join(__dirname, "../../generated_svg");
const PDF_DIRECTORY = path.join(__dirname, "../../generated_pdf");

let svgFilePath: string | undefined;

const getSvgFiles = (): string[] => {
  return fs
    .readdirSync(SVG_DIRECTORY)
    .filter((file) => file.endsWith(".svg"))
    .map((file) => path.join(SVG_DIRECTORY, file));
};

const manageSvgFiles = () => {
  const svgFiles = getSvgFiles();
  /* console.log(`${svgFiles.length} db SVG fájl van.`); */
  if (svgFiles.length > MAX_SVG_FILES) {
    const filesToDelete = svgFiles
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
      .slice(0, svgFiles.length - MAX_SVG_FILES);
    /* console.log(`${filesToDelete.length} db SVG fájl törlése:`, filesToDelete); */
    filesToDelete.forEach((file) => fs.unlinkSync(file));
  }
};

const getPdfFiles = (): string[] => {
  return fs
    .readdirSync(PDF_DIRECTORY)
    .filter((file) => file.endsWith(".pdf"))
    .map((file) => path.join(PDF_DIRECTORY, file));
};

const managePdfFiles = () => {
  const pdfFiles = getPdfFiles();
  /* console.log(`${pdfFiles.length} db PDF fájl van.`); */
  if (pdfFiles.length > MAX_SVG_FILES) {
    const filesToDelete = pdfFiles
      .sort((a, b) => fs.statSync(a).mtimeMs - fs.statSync(b).mtimeMs)
      .slice(0, pdfFiles.length - MAX_SVG_FILES);
    /* console.log(`${filesToDelete.length} db PDF fájl törlése:`, filesToDelete); */
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

    console.log(req.body);

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

      /* console.log("SVG fájl legenerálva:", svgResult, filename); */
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

    const { taskType, graphType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date, svgFilename } = req.body;

    managePdfFiles();

    if (!svgFilename) {
      res.status(400).json({ success: false, message: "Hiányzik az SVG fájl neve." });
      return;
    }

    const svgFilePath = path.join(SVG_DIRECTORY, svgFilename);
    /* console.log("SVG fájl elérési út:", svgFilePath); */

    if (!fs.existsSync(svgFilePath)) {
      res.status(400).json({ success: false, message: "Az SVG fájl nem létezik." });
      return;
    }

    // Az adatok feldolgozása a PDF generálásához
    const pdfResult = await processPdfTask(
      taskType,/* 
      graphType, */
      graphNodes,
      graphEdges,
      taskTitle,
      taskText,
      dateChecked,
      date ? new Date(date) : null,
      svgFilePath
    );

    const pdfFilename = svgFilename.replace('.svg', '.pdf');
    const pdfFilePath = path.join(PDF_DIRECTORY, pdfFilename);
    /* console.log("PDF fájl elérési út:", pdfFilePath); */

    if (!fs.existsSync(pdfFilePath)) {
      res.status(500).json({ success: false, message: "Nem sikerült a PDF generálása." });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${pdfFilename}"`);

    const pdfStream = fs.createReadStream(pdfFilePath);
    pdfStream.pipe(res);
  } catch (error) {
    console.error("Szerver oldali hiba:", error);
    res.status(500).json({ success: false, message: "Szerver oldali hiba" });
  }
};