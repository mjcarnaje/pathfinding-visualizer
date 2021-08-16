import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { dijkstra } from "../algorigthms/dijkstra";
import Node from "../components/Node";
import { INode, Tuple } from "../types";

// DEFAULT
const NUM_ROWS: number = 25;
const NUM_COLS: number = 50;
const START_COOR: Tuple = [5, 5];
const FINISH_COOR: Tuple = [20, 45];

const isEqual = (a: Tuple, b: Tuple) => JSON.stringify(a) === JSON.stringify(b);

const createNode = (col: number, row: number): INode => {
  return {
    row,
    col,
    distance: Infinity,
    isStart: isEqual([row, col], START_COOR),
    isFinish: isEqual([row, col], FINISH_COOR),
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const generateEmptyGrid = (): INode[][] => {
  const rows = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const cols = [];
    for (let col = 0; col < NUM_COLS; col++) {
      cols.push(createNode(col, row));
    }
    rows.push(cols);
  }
  return rows;
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState<INode[][]>(generateEmptyGrid);
  const [startNodeCoor, setStartNodeCoor] = useState<Tuple>(START_COOR);
  const [finishNodeCoor, setFinishNodeCoor] = useState<Tuple>(FINISH_COOR);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleNodeProperty = (
    nodes: INode[][],
    row: number,
    col: number,
    property: keyof typeof INode
  ): INode[][] => {
    const newNodes = [...nodes];
    const node = newNodes[row][col];
    const newNode = { ...node, [property]: !node[property] };
    newNodes[row][col] = newNode;
    return newNodes;
  };

  const toggleWall = (row: number, col: number, by: "click" | "drag"): void => {
    if (by === "click" && !mouseIsPressed) return;
    setNodes(toggleNodeProperty(nodes, row, col, "isWall"));
    setMouseIsPressed(true);
  };

  const onMouseUp = (): void => {
    setMouseIsPressed(false);
  };

  const animateAlgorithm = (visitedNodesInOrder: INode[]): void => {
    for (let nodeIdx = 0; nodeIdx < visitedNodesInOrder.length; nodeIdx++) {
      setTimeout(() => {
        const { row, col } = visitedNodesInOrder[nodeIdx];
        const nodeId = `${row}-${col}`;
        nodesRef.current[nodeId]!.className = "node node-visited";
      }, 4 * nodeIdx);
    }
  };

  const visualizeAlgorithm = (): void => {
    const startNode = nodes[startNodeCoor[0]][startNodeCoor[1]];
    const finishNode = nodes[finishNodeCoor[0]][finishNodeCoor[1]];

    const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
    animateAlgorithm(visitedNodesInOrder);
  };

  const resetBoard = (): void => {
    nodesRef.current = {};
    setNodes(generateEmptyGrid);
  };

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={visualizeAlgorithm}>Visualize</button>
        <button onClick={resetBoard}>Reset</button>
      </div>

      <div style={{ margin: 10 }}>
        {nodes.map((rows, rowIdx) => {
          return (
            <div key={rowIdx}>
              {rows.map((col, colIdx) => {
                const key = `${rowIdx}-${colIdx}`;

                return (
                  <Node
                    key={key}
                    ref={(nodeEl) => (nodesRef.current[key] = nodeEl)}
                    {...col}
                    onMouseDown={() => toggleWall(rowIdx, colIdx, "drag")}
                    onMouseEnter={() => toggleWall(rowIdx, colIdx, "click")}
                    onMouseUp={onMouseUp}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
