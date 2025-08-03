import { useCallback } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface LayoutOptions {
  direction?: 'DOWN' | 'RIGHT' | 'LEFT' | 'UP';
  spacing?: number;
  padding?: number;
}

export function useElkLayout() {
  const applyLayout = useCallback(
    async (nodes: Node[], edges: Edge[], options: LayoutOptions = {}) => {
      const { direction = 'DOWN', spacing = 50, padding = 20 } = options;

      // Convert to ELK format
      const elkNodes = nodes.map(node => ({
        id: node.id,
        width: 150,
        height: 50,
      }));

      const elkEdges = edges.map(edge => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      }));

      const elkGraph = {
        id: 'root',
        layoutOptions: {
          'elk.algorithm': 'layered',
          'elk.direction': direction,
          'elk.spacing.nodeNode': spacing.toString(),
          'elk.padding': `[${padding}, ${padding}, ${padding}, ${padding}]`,
          'elk.layered.spacing.nodeNodeBetweenLayers': spacing.toString(),
        },
        children: elkNodes,
        edges: elkEdges,
      };

      try {
        const newGraph = await elk.layout(elkGraph);

        // Convert back to React Flow format
        const layoutedNodes = nodes.map(node => {
          const elkNode = newGraph.children?.find(n => n.id === node.id);
          if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
            return {
              ...node,
              position: {
                x: elkNode.x,
                y: elkNode.y,
              },
            };
          }
          return node;
        });

        return { nodes: layoutedNodes, edges };
      } catch (error) {
        console.error('ELK layout error:', error);
        return { nodes, edges };
      }
    },
    []
  );

  return { applyLayout };
}
