import type { NextPage } from "next";
import { DragEvent, useEffect, useRef, useState } from "react";
import { dijkstra } from "../algorigthms/dijkstra";
import Nav from "../components/Nav";
import Node, { defaultNodeClassName } from "../components/Node";
import { INode, Tuple } from "../types";

// DEFAULT
const NUM_ROWS: number = 17;
const NUM_COLS: number = 49;
const START_COOR: Tuple = [8, 8];
const FINISH_COOR: Tuple = [8, 40];

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
  const [_startNode, _setStartNode] = useState<Tuple>(START_COOR);
  const [_finishNode, _setFinishNode] = useState<Tuple>(FINISH_COOR);
  const [activeNode, setActiveNode] = useState<"isStart" | "isFinish" | null>(
    null
  );
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  const nodesRef = useRef<Record<string, HTMLTableDataCellElement | null>>({});

  const toggleWall = (row: number, col: number, by: "click" | "drag"): void => {
    if (by === "click" && !mouseIsPressed) return;
    setNodes((nodes) => {
      const newNodes = [...nodes];
      const node = newNodes[row][col];
      const newNode = { ...node, isWall: !node.isWall };
      newNodes[row][col] = newNode;
      return newNodes;
    });
  };

  const onMouseUp = (): void => {
    setMouseIsPressed(false);
  };

  const animateAlgorithm = (visitedNodesInOrder: INode[]): void => {
    for (let nodeIdx = 0; nodeIdx < visitedNodesInOrder.length; nodeIdx++) {
      setTimeout(() => {
        const { row, col } = visitedNodesInOrder[nodeIdx];
        const nodeId = `${row}-${col}`;

        const className = `${defaultNodeClassName} bg-green-300 text-green-800`;

        nodesRef.current[nodeId]!.className = className;
      }, 4 * nodeIdx);
    }
  };

  const visualizeAlgorithm = (): void => {
    const startNode = nodes[_startNode[0]][_startNode[1]];
    const finishNode = nodes[_finishNode[0]][_finishNode[1]];

    const visitedNodesInOrder = dijkstra(nodes, startNode, finishNode);
    animateAlgorithm(visitedNodesInOrder);
  };

  const clearBoard = (): void => {
    nodesRef.current = {};
    setNodes(generateEmptyGrid);
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => e.preventDefault(), false);
  }, []);

  return (
    <div className="min-h-screen">
      <Nav visualizeAlgorithm={visualizeAlgorithm} clearBoard={clearBoard} />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="my-8 grid place-content-center">
          <table>
            <tbody>
              {nodes.map((rows, rowIdx) => (
                <tr key={rowIdx}>
                  {rows.map((col, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`;

                    const specialNode = col.isStart || col.isFinish;

                    return (
                      <Node
                        key={key}
                        ref={(nodeEl) => {
                          nodesRef.current[key] = nodeEl;
                        }}
                        {...col}
                        onMouseDown={() => {
                          if (activeNode) return;
                          toggleWall(rowIdx, colIdx, "drag");
                        }}
                        onMouseEnter={() => {
                          if (activeNode) return;
                          toggleWall(rowIdx, colIdx, "click");
                        }}
                        onMouseUp={onMouseUp}
                        onDragStartSpecialNode={() => {
                          setActiveNode(
                            col.isStart
                              ? "isStart"
                              : col.isFinish
                              ? "isFinish"
                              : null
                          );
                        }}
                        onDragEnter={(e) => {
                          if (!specialNode) return;
                          e.currentTarget.style.background = "red";
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.style.background = "";
                        }}
                        onDrop={(e) => {
                          if (!activeNode) return;

                          let coor: [number, number] =
                            activeNode === "isStart" ? _startNode : _finishNode;

                          console.log("coor init: ", coor);
                          console.log("active_node: ", activeNode);

                          setNodes((nodes) => {
                            const newNodes = [...nodes];

                            const _newNode = newNodes[rowIdx][colIdx];
                            const _oldNode = newNodes[coor[0]][coor[1]];

                            const newNode = {
                              ..._newNode,
                              [activeNode]: true,
                            };

                            const oldNode = {
                              ..._oldNode,
                              [activeNode]: false,
                            };

                            newNodes[rowIdx][colIdx] = newNode;
                            newNodes[coor[0]][coor[1]] = oldNode;

                            console.log("old node: ", oldNode);
                            console.log("new node: ", newNode);

                            coor = [rowIdx, colIdx];

                            if (activeNode === "isStart") {
                              _setStartNode(coor);
                            } else {
                              _setFinishNode(coor);
                            }

                            return newNodes;
                          });
                        }}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
