import Graph from "graphology";
import * as path from "path";
var render = require("graphology-svg");
import { circular, rotation } from "graphology-layout";
import { bfsFromNode, dfsFromNode } from "graphology-traversal";
import { topologicalSort, hasCycle, willCreateCycle } from "graphology-dag";
import * as fs from "fs";

export const generateSvgFile = async (
  taskType: string,
  graphType: string,
  graphNodes: number,
  graphEdges: number,
  acyclicGraph: boolean
): Promise<{ filePath: string; nodeList: string[] }> => {
  if (graphEdges > (graphNodes * (graphNodes - 1)) / 2) {
    throw new Error("Túl sok az él a gráfban!");
  }

  const isDirected = graphType === "irányított";
  const isDAG = isDirected && acyclicGraph;
  const graph = new Graph({
    type: isDirected ? "directed" : "undirected",
    allowSelfLoops: isDAG ? false : true,
  });
  const bfsNodeList: string[] = [];
  const dfsNodeList: string[] = [];
  let nodeList: string[] = [];

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
    let source: number, target: number;
    let sourceStr: string, targetStr: string;

    if (isDAG) {
      do {
        source = Math.floor(Math.random() * graphNodes);
        target = Math.floor(Math.random() * graphNodes);
        sourceStr = source.toString();
        targetStr = target.toString();
      } while (
        graph.hasEdge(sourceStr, targetStr) ||
        willCreateCycle(graph, sourceStr, targetStr)
      );
    } else {
      do {
        source = Math.floor(Math.random() * graphNodes);
        target = Math.floor(Math.random() * graphNodes);
        sourceStr = source.toString();
        targetStr = target.toString();
      } while (
        source === target ||
        graph.hasEdge(sourceStr, targetStr)
      );
    }

    graph.addEdge(sourceStr, targetStr, { color: "#999797", size: 5 });
  }

  circular.assign(graph, { scale: 30 });
  rotation.assign(graph, (3 * Math.PI) / 2, { centeredOnZero: true });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
  const filePath = `./generated_svg/${timestamp}.svg`;

  await new Promise<void>((resolve, reject) => {
    render(
      graph,
      filePath,
      { width: 1000, height: 1000, margin: 120 },
      (err: Error) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });

  if (taskType === "mélységi bejárás") {
    dfsFromNode(graph, "0", (node) => {
      dfsNodeList.push(node);
    });
    nodeList = dfsNodeList;
  } else if (taskType === "szélességi bejárás") {
    bfsFromNode(graph, "0", (node) => {
      bfsNodeList.push(node);
    });
    nodeList = bfsNodeList;
  } else if (isDAG) {
    nodeList = topologicalSort(graph);
  }

  return { filePath, nodeList };
};