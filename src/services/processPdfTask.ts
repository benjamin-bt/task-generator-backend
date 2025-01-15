import { generatePdfFile } from "./generatePDF";

export const processPdfTask = async (
  taskType: string,
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
    const { message, outputPath } = await generatePdfFile(taskType, taskTitle, taskText, date, svgFilePath);

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
