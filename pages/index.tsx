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

  const toggleWall = (row: number, col: number): void => {
    setNodes((nodes) => {
      const newNodes = [...nodes];
      const node = newNodes[row][col];
      const newNode = { ...node, isWall: !node.isWall };
      newNodes[row][col] = newNode;
      return newNodes;
    });
  };

  const onDropSpecialNode = (
    e: DragEvent<HTMLTableDataCellElement>,
    rowIdx: number,
    colIdx: number
  ): void => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-200");

    if (!activeNode) return;
    const isStart = activeNode === "isStart";

    let coor: [number, number] = isStart ? _startNode : _finishNode;

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

    newNodes[coor[0]][coor[1]] = oldNode;
    newNodes[rowIdx][colIdx] = newNode;

    coor = [rowIdx, colIdx];

    setNodes(newNodes);
    if (isStart) {
      _setStartNode(coor);
    } else {
      _setFinishNode(coor);
    }
  };

  const animateAlgorithm = (sortedVisitedNodes: INode[]): void => {
    sortedVisitedNodes.forEach((node, nodeIdx) => {
      setTimeout(() => {
        const { row, col } = node;
        const nodeId = `${row}-${col}`;
        nodesRef.current[nodeId]?.classList.add(
          "bg-green-300",
          "text-green-800"
        );
      }, 5 * nodeIdx);
    });
  };

  const visualizeAlgorithm = (): void => {
    const startNode = nodes[_startNode[0]][_startNode[1]];
    const finishNode = nodes[_finishNode[0]][_finishNode[1]];
    const sortedVisitedNodes = dijkstra(nodes, startNode, finishNode);
    animateAlgorithm(sortedVisitedNodes);
  };

  const clearBoard = (): void => {
    const newNodes = generateEmptyGrid();
    setNodes(newNodes);
    _setStartNode(START_COOR);
    _setFinishNode(FINISH_COOR);
    newNodes.flat().forEach((node) => {
      const { row, col } = node;
      const nodeId = `${row}-${col}`;
      nodesRef.current[nodeId]?.classList.remove(
        "bg-green-300",
        "text-green-800"
      );
    });
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => e.preventDefault(), false);
  }, []);

  return (
    <div className="min-h-screen">
      <Nav visualizeAlgorithm={visualizeAlgorithm} clearBoard={clearBoard} />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid my-8 place-content-center">
          <table>
            <tbody>
              {nodes.map((rows, rowIdx) => (
                <tr key={rowIdx}>
                  {rows.map((col, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`;

                    return (
                      <Node
                        key={key}
                        ref={(nodeEl) => {
                          nodesRef.current[key] = nodeEl;
                        }}
                        {...col}
                        _onDragStart={() => {
                          const _activeNode = col.isStart
                            ? "isStart"
                            : col.isFinish
                            ? "isFinish"
                            : null;
                          setActiveNode(_activeNode);
                        }}
                        onMouseDown={() => setMouseIsPressed(true)}
                        onMouseUp={() => setMouseIsPressed(false)}
                        onMouseOver={() => {}}
                        onDragEnter={(e) => {
                          e.currentTarget.classList.add("bg-gray-200");
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("bg-gray-200");
                        }}
                        onDrop={(e) => onDropSpecialNode(e, rowIdx, colIdx)}
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
