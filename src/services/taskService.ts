import { graph } from "ts-graphviz";
import { generateRandomGraph } from "./generateGraph";

export const processTask = (
    taskType: string,
    graphNodes: number,
    graphEdges: number,
    taskTitle: string,
    taskText: string,
    dateChecked: boolean,
    date: Date | null
  ) => {
    // feldolgozás szmiulációja a bemeneti adatok alapján
    let result;
  
    switch (taskType) {
      case "szélességi bejárás":
        result = `Creating a task for BFS with ${graphNodes} nodes and ${graphEdges} edges.`;
        break;
  
      case "mélységi bejárás":
        result = `Creating a task for DFS with ${graphNodes} nodes and ${graphEdges} edges.`;
        break;
  
      case "topologikus rendezés":
        result = `Creating a topological sort task with ${graphNodes} nodes.`;
        break;
  
      default:
        result = "Invalid task type.";
    }

    const graph = generateRandomGraph(graphNodes, graphEdges);
  
    // A feldolgozás eredménye
    return {
      success: true,
      task: {
        taskType: taskType,
        taskTitleitle: taskTitle.toUpperCase(),
        taskTextext: taskText,
        graphNodes: graphNodes,
        graphEdges: graphEdges,
        dateChecked,
        date,
        description: result,
        graph: graph,
      },
    };
  };