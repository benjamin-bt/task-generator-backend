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
exports.generateSvgFile = void 0;
const graphology_1 = __importDefault(require("graphology"));
var render = require("graphology-svg");
const graphology_layout_1 = require("graphology-layout");
const graphology_traversal_1 = require("graphology-traversal");
const graphology_dag_1 = require("graphology-dag");
const generateSvgFile = (taskType, graphType, graphNodes, graphEdges, acyclicGraph) => __awaiter(void 0, void 0, void 0, function* () {
    if (graphEdges > (graphNodes * (graphNodes - 1)) / 2) {
        throw new Error("Túl sok az él a gráfban!");
    }
    const isDirected = graphType === "irányított";
    const isDAG = isDirected && acyclicGraph;
    const graph = new graphology_1.default({
        type: isDirected ? "directed" : "undirected",
        allowSelfLoops: isDAG ? false : true,
    });
    const bfsNodeList = [];
    const dfsNodeList = [];
    let nodeList = [];
    for (let i = 0; i < graphNodes; i++) {
        graph.addNode(i.toString(), {
            size: 3,
            color: "#D3D3D3",
            label: `${i}`,
        });
    }
    for (let i = 1; i < graphNodes; i++) {
        const source = Math.floor(Math.random() * i).toString();
        const target = i.toString();
        if (!graph.hasEdge(source, target)) {
            graph.addEdge(source, target, { color: "#999797", size: 5 });
        }
    }
    while (graph.size < graphEdges) {
        let source, target;
        let sourceStr, targetStr;
        if (isDAG) {
            do {
                source = Math.floor(Math.random() * graphNodes);
                target = Math.floor(Math.random() * graphNodes);
                sourceStr = source.toString();
                targetStr = target.toString();
            } while (graph.hasEdge(sourceStr, targetStr) ||
                (0, graphology_dag_1.willCreateCycle)(graph, sourceStr, targetStr));
        }
        else {
            do {
                source = Math.floor(Math.random() * graphNodes);
                target = Math.floor(Math.random() * graphNodes);
                sourceStr = source.toString();
                targetStr = target.toString();
            } while (source === target ||
                graph.hasEdge(sourceStr, targetStr));
        }
        graph.addEdge(sourceStr, targetStr, { color: "#999797", size: 5 });
    }
    graphology_layout_1.circular.assign(graph, { scale: 30 });
    graphology_layout_1.rotation.assign(graph, (3 * Math.PI) / 2, { centeredOnZero: true });
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const filePath = `./generated_svg/${timestamp}.svg`;
    yield new Promise((resolve, reject) => {
        render(graph, filePath, { width: 1000, height: 1000, margin: 120 }, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
    if (taskType === "mélységi bejárás") {
        (0, graphology_traversal_1.dfsFromNode)(graph, "0", (node) => {
            dfsNodeList.push(node);
        });
        nodeList = dfsNodeList;
    }
    else if (taskType === "szélességi bejárás") {
        (0, graphology_traversal_1.bfsFromNode)(graph, "0", (node) => {
            bfsNodeList.push(node);
        });
        nodeList = bfsNodeList;
    }
    else if (isDAG) {
        nodeList = (0, graphology_dag_1.topologicalSort)(graph);
    }
    return { filePath, nodeList };
});
exports.generateSvgFile = generateSvgFile;
