import { useState } from "react";
import type { NextPage } from "next";

import Node from "../components/Node";
import styles from "../styles/Home.module.css";
import { INode } from "../types/node.types";
import { dijkstra } from "../algorigthms/dijkstra";

const NUM_ROWS: number = 24;
const NUM_COLS: number = 50;
const START_NODE: [number, number] = [10, 15];
const FINISH_NODE: [number, number] = [10, 35];

const createNode = (colIdx: number, rowIdx: number): INode => {
  return {
    rowIdx,
    colIdx,
    distance: Infinity,
    isStart: rowIdx === START_NODE[0] && colIdx === START_NODE[1],
    isFinish: rowIdx === FINISH_NODE[0] && colIdx === FINISH_NODE[1],
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const withWallToggledGrid = (
  grid: INode[][],
  rowIdx: number,
  colIdx: number
): INode[][] => {
  const newNodes = [...grid];
  const node = newNodes[rowIdx][colIdx];
  const newNode = { ...node, isWall: !node.isWall };
  newNodes[rowIdx][colIdx] = newNode;
  return newNodes;
};

function generateEmptyGrid() {
  const rows = [];
  for (let rowIdx = 0; rowIdx < NUM_ROWS; rowIdx++) {
    const cols = [];
    for (let colIdx = 0; colIdx < NUM_COLS; colIdx++) {
      cols.push(createNode(colIdx, rowIdx));
    }
    rows.push(cols);
  }
  return rows;
}

const Home: NextPage = () => {
  const [nodes, setNodes] = useState(generateEmptyGrid);

  const animateDijkstra = (visitedNodesInOrder: INode[]): void => {
    for (let idx = 0; idx < visitedNodesInOrder.length; idx++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[idx];

        document.getElementById(
          `node-${node.rowIdx}-${node.colIdx}`
        )!.className = "node node-visited";
      }, 10 * idx);
    }
  };

  const visualizeDijkstra = (): void => {
    const startNode = nodes[START_NODE[0]][START_NODE[1]];
    const finishNode = nodes[FINISH_NODE[0]][FINISH_NODE[1]];

    const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
    animateDijkstra(visitedNodesInOrder);
  };

  return (
    <div className={styles.container}>
      <button onClick={() => visualizeDijkstra()}>start</button>
      <div style={{ margin: 10 }}>
        {nodes.map((rows, rowsIdx) => {
          return (
            <div key={rowsIdx}>
              {rows.map((row, rowIdx) => (
                <Node key={rowIdx} {...row} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
