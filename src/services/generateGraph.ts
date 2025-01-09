import Graph from 'graphology';
const seedrandom = require('seedrandom');

// Function to generate a random connected simple graph with seeded randomness
export const generateRandomGraph = (graphNodes: number, graphEdges: number): Graph => {
  const graph = new Graph();

  // Use a random seed for better randomness
  const rng = seedrandom(Math.random().toString());

  // Add nodes
  for (let i = 0; i < graphNodes; i++) {
    graph.addNode(i.toString());
  }

  // Step 1: Create a spanning tree (guaranteeing connectivity)
  for (let i = 1; i < graphNodes; i++) {
    graph.addEdge((i - 1).toString(), i.toString());
  }

  // Step 2: Add random edges using the seeded RNG
  let edgeCount = graphNodes - 1; // We already have (n-1) edges from the tree
  while (edgeCount < graphEdges) {
    const node1 = Math.floor(rng() * graphNodes).toString();
    const node2 = Math.floor(rng() * graphNodes).toString();

    // Avoid self-loops and duplicate edges
    if (node1 !== node2 && !graph.hasEdge(node1, node2)) {
      graph.addEdge(node1, node2);
      edgeCount++;
    }
  }

  console.log(graph);
  return graph;
};
