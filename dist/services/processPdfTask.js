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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPdfTask = void 0;
const generatePDF_1 = require("./generatePDF");
const processPdfTask = (taskType, graphNodes, graphEdges, taskTitle, taskText, dateChecked, date, svgFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // A PDF generálásához szükséges adatok feldolgozása
        const { message, outputPath } = yield (0, generatePDF_1.generatePdfFile)(taskType, taskTitle, taskText, date, svgFilePath);
        /* console.log(message); */
        return {
            success: true,
            task: {
                taskType: taskType,
                taskTitle: taskTitle.toUpperCase(),
                taskText: taskText,
                graphNodes: graphNodes,
                graphEdges: graphEdges,
                dateChecked,
                date,
                svgFilePath: svgFilePath,
                filePath: outputPath,
            },
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Hiba:", error.message);
        }
        else {
            console.error("Váratlan hiba:", error);
        }
        return {
            success: false,
            message: "A feldolgozás sikertelen volt.",
        };
    }
});
exports.processPdfTask = processPdfTask;
