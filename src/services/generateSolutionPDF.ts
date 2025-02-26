import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import sharp from "sharp";
import fsp from "fs/promises";
import path from "path";

const PDF_SOLUTION_DIRECTORY = path.join(
  __dirname,
  "../../generated_solution_pdf"
);

const waitForFile = async (filePath: string) => {
  while (true) {
    try {
      await fsp.access(filePath);
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

sharp.cache(false);

export const generateSolutionPdfFile = async (
  taskType: string,
  graphType: string,
  nodeListBack: [],
  taskTitle: string,
  taskText: string,
  date: Date | null,
  svgFilePath: string
): Promise<{ message: string; outputPath: string }> => {
  try {
    await waitForFile(svgFilePath); // Az SVG fájlra várunk, amíg elkészül
    const svgBuffer = await fsp.readFile(svgFilePath);
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([600, 800]); // Oldalméret

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const graphImage = await pdfDoc.embedPng(pngBuffer);
    const graphDims = graphImage.scale(0.3);

    const pageWidth = page.getWidth();
    const imageX = (pageWidth - graphDims.width) / 2;

    page.drawText(`${taskType}`, {
      x: 25,
      y: 775,
      font,
      size: 10,
      color: rgb(0, 0, 0),
    });

    const parsedDate = date ? new Date(date) : null;
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      const formattedDate = parsedDate.toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const textWidth = font.widthOfTextAtSize(formattedDate, 10);
      const xPosition = pageWidth - 25 - textWidth;

      page.drawText(`${formattedDate}`, {
        x: xPosition,
        y: 775,
        font,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }

    page.drawText(`${taskType}`, {
      x: 50,
      y: 725,
      font,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawImage(graphImage, {
      x: imageX,
      y: 400,
      width: graphDims.width,
      height: graphDims.height,
    });

    page.drawText(`${nodeListBack}`, {
      x: 50,
      y: 700 - graphDims.height,
      font,
      size: 12,
      color: rgb(0, 0, 0),
      maxWidth: 500,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfFilename = path
      .basename(svgFilePath)
      .replace(".svg", "_megoldas.pdf");
    const outputPath = path.join(PDF_SOLUTION_DIRECTORY, pdfFilename);
    await fsp.writeFile(outputPath, pdfBytes);

    return { message: "PDF generálása sikeres", outputPath };
  } catch (error) {
    console.error("Hiba a PDF generálása közben:", error);
    throw new Error("Nem sikerült a PDF generálása");
  }
};
