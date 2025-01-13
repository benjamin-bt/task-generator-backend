import Graph from 'graphology';
import * as path from "path";
var render = require('graphology-svg');
import { circular, rotation, random } from 'graphology-layout';

/**
 * @param taskTitle
 * @param graphNodes
 * @param graphEdges
 * @returns
 */
export const generateSvgFile = async (graphNodes: number, graphEdges: number): Promise<{ filePath: string }> => {
  if (graphEdges > (graphNodes * (graphNodes - 1)) / 2) {
    throw new Error('Túl sok az él a gráfban!');
  }

  const graph = new Graph({ type: 'undirected' });

  // Csúcsok hozzáadása a gráfhoz
  for (let i = 0; i < graphNodes; i++) {
    graph.addNode(i.toString(), {
      size: 3,
      color: '#D3D3D3',
      label: `${i}`,
    });
  }

  // Élek hozzáadása a gráfhoz, hogy összefüggő legyen
  for (let i = 1; i < graphNodes; i++) {
    const source = Math.floor(Math.random() * i).toString();
    const target = i.toString();

    if (!graph.hasEdge(source, target)) {
      graph.addEdge(source, target, {
        color: '#4d4d4d',
        size: 5,
      });
    }
  }

  // A gráf maradék éleinek hozzáadása véletlenszerűen
  const edges = new Set<string>();
  while (graph.size < graphEdges) {
    const source = Math.floor(Math.random() * graphNodes).toString();
    const target = Math.floor(Math.random() * graphNodes).toString();

    if (source !== target && !graph.hasEdge(source, target)) {
      graph.addEdge(source, target, {
        color: '#4d4d4d',
        size: 5,
      });
    }
  }

  // A gráf elrendezése kör alakban, a rendezettség érdekében
  circular.assign(graph, { scale: 30 });

  // A gráf elforgatása, hogy a 0 csúcs mindig felül legyen
  rotation.assign(graph, (3 * Math.PI) / 2, { centeredOnZero: true });

  const timestamp = new Date().toISOString().replace(/[:.-]/g, ''); // Időbélyeg a fájl nevében
  const filePath = `./generated_svg/${timestamp}.svg`; // A fájl elérési útja

  // A gráf SVG fájlba való renderelése
  render(
    graph,
    filePath,
    {
      width: 1000,
      height: 1000,
      margin: 120,
    },
    () => console.log('SVG fájl létrehozva.')
  );

  console.log(graph);
  return { filePath };
};
