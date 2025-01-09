import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import * as fs from "fs";
import * as fsp from "fs/promises";
import sharp from "sharp";

const waitForFile = async (filePath: string): Promise<void> => {
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

export const generatePDF = async (
  taskType: string,
  taskTitle: string,
  taskText: string,
  date: Date | null
): Promise<string> => {
  try {
    const svgPath = "./graph_svg/graph.svg";
    await waitForFile(svgPath);
    const svgBuffer = await fsp.readFile(svgPath);
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([600, 800]); // Oldalméret

    // Betűtípus
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // A gráf beolvasása és méretezése
    const graphImage = await pdfDoc.embedPng(pngBuffer);
    const graphDims = graphImage.scale(0.3);

    const pageWidth = page.getWidth();
    const imageX = (pageWidth - graphDims.width) / 2;

    // Feladattípus
    page.drawText(`${taskType}`, {
      x: 25,
      y: 775,
      font,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Dátum (ha meg van adva)
    const parsedDate = date ? new Date(date) : null;
    if (parsedDate && parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
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

    // Feladat címe
    page.drawText(`${taskTitle}`, {
      x: 50,
      y: 725,
      font,
      size: 18,
      color: rgb(0, 0, 0),
    });

    // Feladat szövege
    page.drawText(`${taskText}`, {
      x: 50,
      y: 700,
      font,
      size: 12,
      color: rgb(0, 0, 0),
      maxWidth: 500,
    });

    // Gráf elhelyezése a PDF-en, középre igazítva
    page.drawImage(graphImage, {
      x: imageX,
      y: 375,
      width: graphDims.width,
      height: graphDims.height,
    });

    // PDF fájl mentése
    const pdfBytes = await pdfDoc.save();
    const outputPath = "./generated_pdf/generated_task.pdf";
    fs.writeFileSync(outputPath, pdfBytes);

    console.log("PDF fájl létrehozva.");
    return `PDF elmentve: ${outputPath}`;
  } catch (error) {
    console.error("Hiba a PDF fájl létrehozásakor:", error);
    throw new Error("Nem sikerült a PDF fájl létrehozása.");
  }
};
