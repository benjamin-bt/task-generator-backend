import { generateRandomGraph } from "./generateGraph";
import { generatePDF } from "./generatePDF";

export const processTask = async (
  taskType: string,
  graphNodes: number,
  graphEdges: number,
  taskTitle: string,
  taskText: string,
  dateChecked: boolean,
  date: Date | null
) => {
  try {
    // Generate the graph
    const graph = generateRandomGraph(graphNodes, graphEdges);

    // Generate the PDF
    const message = await generatePDF(taskType, taskTitle, taskText, date);

    console.log(message); // Logs the success message

    // Return the task processing result
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
    // Handle the error by narrowing its type
    if (error instanceof Error) {
      console.error("Error:", error.message); // Safely logs the error message
    } else {
      console.error("Unexpected error:", error); // Handles non-Error objects
    }

    // Return failure response
    return {
      success: false,
      message: "Task processing failed due to an error.",
    };
  }
};
