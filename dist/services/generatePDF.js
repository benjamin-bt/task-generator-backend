"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdfFile = void 0;
const pdf_lib_1 = require("pdf-lib");
const sharp_1 = __importDefault(require("sharp"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const PDF_DIRECTORY = path_1.default.join(__dirname, "../../generated_pdf");
const waitForFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    while (true) {
        try {
            yield promises_1.default.access(filePath);
            break;
        }
        catch (_a) {
            yield new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
});
sharp_1.default.cache(false);
const generatePdfFile = (taskType, taskTitle, taskText, date, svgFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield waitForFile(svgFilePath); // Az SVG fájlra várunk, amíg elkészül
        const svgBuffer = yield promises_1.default.readFile(svgFilePath);
        const pngBuffer = yield (0, sharp_1.default)(svgBuffer).png().toBuffer();
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]); // Oldalméret
        const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        const graphImage = yield pdfDoc.embedPng(pngBuffer);
        const graphDims = graphImage.scale(0.3);
        const pageWidth = page.getWidth();
        const imageX = (pageWidth - graphDims.width) / 2;
        page.drawText(`${taskType}`, {
            x: 25,
            y: 775,
            font,
            size: 10,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
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
                color: (0, pdf_lib_1.rgb)(0, 0, 0),
            });
        }
        page.drawText(`${taskTitle}`, {
            x: 50,
            y: 725,
            font,
            size: 18,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
        page.drawImage(graphImage, {
            x: imageX,
            y: 400,
            width: graphDims.width,
            height: graphDims.height,
        });
        page.drawText(`${taskText}`, {
            x: 50,
            y: 700 - graphDims.height,
            font,
            size: 12,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
            maxWidth: 500,
        });
        const pdfBytes = yield pdfDoc.save();
        const pdfFilename = path_1.default.basename(svgFilePath).replace('.svg', '.pdf');
        const outputPath = path_1.default.join(PDF_DIRECTORY, pdfFilename);
        yield promises_1.default.writeFile(outputPath, pdfBytes);
        return { message: 'PDF generálása sikeres', outputPath };
    }
    catch (error) {
        console.error('Hiba a PDF generálása közben:', error);
        throw new Error('Nem sikerült a PDF generálása');
    }
});
exports.generatePdfFile = generatePdfFile;
