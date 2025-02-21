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
exports.processSvgTask = void 0;
const generateSVG_1 = require("./generateSVG");
const processSvgTask = (taskType, graphType, graphNodes, graphEdges, acyclicGraph) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, generateSVG_1.generateSvgFile)(taskType, graphType, graphNodes, graphEdges, acyclicGraph);
        /* console.log(result); */
        return {
            success: true,
            task: {
                graphNodes: graphNodes,
                graphEdges: graphEdges,
                result,
                svgFilePath: result.filePath,
                nodeList: result.nodeList,
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
exports.processSvgTask = processSvgTask;
