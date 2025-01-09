import Graph from 'graphology';
var render = require('graphology-svg');
import { circular, rotation } from 'graphology-layout';

/**
 @param graphNodes
 @param graphEdges
 @returns
*/
export const generateRandomGraph = (graphNodes: number, graphEdges: number): Graph => {
  if (graphEdges > (graphNodes * (graphNodes - 1)) / 2) {
    throw new Error('Túl sok az él a gráfban!');
  }

  const graph = new Graph({ type: 'undirected' }); // A gráf létrehozása

  // A gráf csúcsainak hozzáadása paraméterezve
  for (let i = 0; i < graphNodes; i++) {
    graph.addNode(i.toString(), {
      size: 3,
      color: '#D3D3D3',
      label: `${i}`,
    });
  }

  // A gráf éleinek hozzáadása paraméterezve (ensuring connectivity)
  for (let i = 1; i < graphNodes; i++) {
    const source = Math.floor(Math.random() * i).toString();
    const target = i.toString();

    if (!graph.hasEdge(source, target)) {
      graph.addEdge(source, target, {
        color: '#75746f',
        size: 5,
      });
    }
  }

  // A többi él hozzáadása véletlenszerűen, de úgy, hogy ne legyenek hurokélek és párhuzamos élek
  const edges = new Set<string>();
  while (graph.size < graphEdges) {
    const source = Math.floor(Math.random() * graphNodes).toString();
    const target = Math.floor(Math.random() * graphNodes).toString();

    // Prevent loops and check for existing edges
    if (source !== target && !graph.hasEdge(source, target)) {
      graph.addEdge(source, target, {
        color: '#75746f',
        size: 5,
      });
    }
  }

  // A gráf csúcsainak elrendezése kör alakban
  circular.assign(graph, { scale: 30 });

  // A gráf elforgatása, hogy a 0 mindig felül legyen
  rotation.assign(graph, (3 * Math.PI) / 2, { centeredOnZero: true });

  // A gráf kirajzolása SVG formátumban
  render(
    graph,
    './graph_svg/graph.svg',
    {
      width: 1000,
      height: 1000,
      margin: 120,
    },
    () => console.log('SVG fájl létrehozva.')
  );

  console.log(graph);
  return graph;
};
