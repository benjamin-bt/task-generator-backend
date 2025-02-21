import { generateSvgFile }  from "./generateSVG"

export const processSvgTask = async (
  taskType: string,
  graphType: string,
  graphNodes: number,
  graphEdges: number,
  acyclicGraph: boolean
) => {
  try {

    const result = await generateSvgFile(taskType, graphType, graphNodes, graphEdges, acyclicGraph);

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
