import { generateSvgFile } from "./generateSVG";
import { generatePdfFile } from "./generatePDF";

export const processTask = async (
  taskType: string,
  graphType: string,
  graphNodes: number,
  graphEdges: number,
  taskTitle: string,
  taskText: string,
  dateChecked: boolean,
  date: Date | null,
  svgFilePath: string
) => {
  try {
    // A gráf generálása
    const graph = generateSvgFile(taskType, graphType, graphNodes, graphEdges);

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
  } catch (error) {
    if (error instanceof Error) {
      console.error("Hiba:", error.message);
    } else {
      console.error("Váratlan hiba:", error);
    }

    // Sikeres feldolgozás esetén a visszatérési érték
    return {
      success: false,
      message: "A feldolgozás sikertelen volt.",
    };
  }
};
