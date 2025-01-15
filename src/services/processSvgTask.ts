import { generateSvgFile }  from "./generateSVG"

export const processSvgTask = async (
  graphNodes: number,
  graphEdges: number,
) => {
  try {

    const result = await generateSvgFile(graphNodes, graphEdges);

    /* console.log(result); */

    return {
      success: true,
      task: {
        graphNodes: graphNodes,
        graphEdges: graphEdges,
        result,
        svgFilePath: result.filePath,
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
