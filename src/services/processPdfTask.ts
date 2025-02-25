import { generateTaskPdfFile } from "./generateTaskPDF";
import { generateSolutionPdfFile } from "./generateSolutionPDF";

export const processPdfTask = async (
  taskType: string,
  graphType: string,
  nodeListBack: any,
  graphNodes: number,
  graphEdges: number,
  taskTitle: string,
  taskText: string,
  dateChecked: boolean,
  date: Date | null,
  svgFilePath: string
) => {
  try {
    // A PDF generálásához szükséges adatok feldolgozása
    const { message, outputPath } = await generateTaskPdfFile(
      taskType,
      graphType,
      taskTitle,
      taskText,
      date,
      svgFilePath
    );
    const { message: message2, outputPath: outputPath2 } =
      await generateSolutionPdfFile(
        taskType,
        graphType,
        nodeListBack,
        taskTitle,
        taskText,
        date,
        svgFilePath
      );

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
        taskFilePath: outputPath,
        solutionFilePath: outputPath2,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Hiba:", error.message);
    } else {
      console.error("Váratlan hiba:", error);
    }

    return {
      success: false,
      message: "A feldolgozás sikertelen volt.",
    };
  }
};
