"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = exports.generateSvg = void 0;
const processPdfTask_1 = require("../services/processPdfTask");
const processSvgTask_1 = require("../services/processSvgTask");
const validationUtils_1 = require("../utils/validationUtils");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MAX_SVG_FILES = 10;
const SVG_DIRECTORY = path.join(__dirname, "../../generated_svg");
const PDF_DIRECTORY = path.join(__dirname, "../../generated_pdf");
let svgFilePath;
const getSvgFiles = () => {
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
const getPdfFiles = () => {
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
const generateSvg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, validationUtils_1.validateSvgInput)(req.body);
        if (validationError) {
            res.status(400).json({ success: false, message: validationError });
            return;
        }
        const { taskType, graphType, graphNodes, graphEdges, acyclicGraph } = req.body;
        console.log(req.body);
        const svgResult = yield (0, processSvgTask_1.processSvgTask)(taskType, graphType, graphNodes, graphEdges, acyclicGraph);
        /* console.log("SVG fájl generálás eredménye:", svgResult); */
        if (svgResult.success && svgResult.task) {
            const { svgFilePath, nodeList } = svgResult.task;
            manageSvgFiles();
            const filename = path.basename(svgFilePath);
            res.setHeader("Content-Type", "image/svg+xml");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.setHeader("X-Filename", filename);
            res.setHeader("X-Node-List", JSON.stringify(nodeList));
            res.setHeader("Access-Control-Expose-Headers", "X-Filename, X-Node-List");
            res.status(200).sendFile(path.resolve(svgFilePath));
            /* console.log("SVG fájl legenerálva:", svgResult, filename); */
        }
        else {
            res
                .status(500)
                .json({ success: false, message: "Hiba az SVG fájl generálásakor" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Szerver oldali hiba" });
    }
});
exports.generateSvg = generateSvg;
// PDF generálása
const generatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationError = (0, validationUtils_1.validatePdfInput)(req.body);
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
        const pdfResult = yield (0, processPdfTask_1.processPdfTask)(taskType, /*
        graphType, */ graphNodes, graphEdges, taskTitle, taskText, dateChecked, date ? new Date(date) : null, svgFilePath);
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
    }
    catch (error) {
        console.error("Szerver oldali hiba:", error);
        res.status(500).json({ success: false, message: "Szerver oldali hiba" });
    }
});
exports.generatePdf = generatePdf;
