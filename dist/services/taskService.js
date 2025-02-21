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
exports.processTask = void 0;
const generateSVG_1 = require("./generateSVG");
const processTask = (taskType, graphType, graphNodes, graphEdges, acyclicGraph, taskTitle, taskText, dateChecked, date, svgFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // A gráf generálása
        const graph = (0, generateSVG_1.generateSvgFile)(taskType, graphType, graphNodes, graphEdges, acyclicGraph);
        // A feldolgozás eredménye
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
                graph: graph,
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
        // Sikeres feldolgozás esetén a visszatérési érték
        return {
            success: false,
            message: "A feldolgozás sikertelen volt.",
        };
    }
});
exports.processTask = processTask;
