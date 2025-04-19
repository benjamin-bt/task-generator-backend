import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import fsp from "fs/promises";
import path from "path";

const PDF_TASK_DIRECTORY = path.join(__dirname, "../../generated_task_pdf");

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

export const generateTaskPdfFile = async (
  taskType: string,
  graphType: string,
  taskTitle: string,
  taskText: string,
  date: Date | null,
  svgFilePath: string
): Promise<{ message: string; outputPath: string }> => {
  try {
    await waitForFile(svgFilePath); // Az SVG fájlra várunk, amíg elkészül

    console.log(date);
    const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
      const words = text.split(' ');
      let lines = [];
      let currentLine = words[0];
    
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const svgBuffer = await fsp.readFile(svgFilePath);
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([600, 800]); // Oldalméret
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fsp.readFile(path.join(__dirname, '../../fonts/Roboto-Regular.ttf'));
    const font = await pdfDoc.embedFont(fontBytes);

    const graphImage = await pdfDoc.embedPng(pngBuffer);
    const graphDims = graphImage.scale(0.3);

    const pageWidth = page.getWidth();
    const taskTitleHeight = font.heightAtSize(18);
    const taskTitleLines = wrapText(taskTitle, pageWidth - 100, font, 18);
    let taskTitleY = 725;
    const imageX = (pageWidth - graphDims.width) / 2;

    taskTitleLines.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: taskTitleY,
        font,
        size: 18,
        color: rgb(0, 0, 0),
      });
      taskTitleY -= font.heightAtSize(18) + 5;
    });

    const imageY = taskTitleY - graphDims.height - 25;
    const taskTextY = imageY - 25;

    page.drawImage(graphImage, {
      x: imageX,
      y: imageY,
      width: graphDims.width,
      height: graphDims.height,
    });

    page.drawText(`${taskText}`, {
      x: 50,
      y: taskTextY,
      font,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const parsedDate = date ? new Date(date) : null;
    if (
      parsedDate &&
      parsedDate instanceof Date &&
      !isNaN(parsedDate.getTime())
    ) {
      parsedDate.setHours(parsedDate.getHours() + 2);
    
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

    const pdfBytes = await pdfDoc.save();
    const pdfFilename = path.basename(svgFilePath).replace(".svg", ".pdf");
    const outputPath = path.join(PDF_TASK_DIRECTORY, pdfFilename);
    await fsp.writeFile(outputPath, pdfBytes);

    return { message: "PDF generálása sikeres", outputPath };
  } catch (error) {
    console.error("Hiba a PDF generálása közben:", error);
    throw new Error("Nem sikerült a PDF generálása");
  }
};