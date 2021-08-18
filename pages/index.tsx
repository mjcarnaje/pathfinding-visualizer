import type { NextPage } from "next";
import { DragEvent, useEffect, useRef, useState } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../algorigthms/dijkstra";
import Nav from "../components/Nav";
import Node from "../components/Node";
import { FINISH_COOR, NUM_COLS, NUM_ROWS, START_COOR } from "../constant";
import { IActiveNode, ICoor, INode, Maybe } from "../types";
import { getNodeId, isEqual } from "../utils";

const createNode = (col: number, row: number): INode => {
  return {
    col,
    row,
    distance: Infinity,
    isStart: isEqual([col, row], START_COOR),
    isFinish: isEqual([col, row], FINISH_COOR),
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const generateEmptyGrid = (): INode[][] => {
  const grid = [];
  for (let col = 0; col < NUM_COLS; col++) {
    const cols = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      cols.push(createNode(col, row));
    }
    grid.push(cols);
  }
  return grid;
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState<INode[][]>(generateEmptyGrid);
  const [_startNode, _setStartNode] = useState<ICoor>(START_COOR);
  const [_finishNode, _setFinishNode] = useState<ICoor>(FINISH_COOR);
  const [activeNode, setActiveNode] = useState<Maybe<IActiveNode>>(null);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [ms, setMs] = useState(10);

  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleWall = (col: number, row: number): void => {
    setNodes((nodes) => {
      const newNodes = [...nodes];
      const node = newNodes[col][row];
      const newNode = { ...node, isWall: !node.isWall };
      newNodes[col][row] = newNode;
      return newNodes;
    });
  };

  const onDropSpecialNode = (
    e: DragEvent<HTMLDivElement>,
    colIdx: number,
    rowIdx: number
  ): void => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-gray-200");

    if (!activeNode) return;
    const isStart = activeNode === "isStart";

    let coor: [number, number] = isStart ? _startNode : _finishNode;

    const newNodes = [...nodes];

    const _newNode = newNodes[colIdx][rowIdx];
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
    newNodes[colIdx][rowIdx] = newNode;

    coor = [colIdx, rowIdx];

    setNodes(newNodes);
    if (isStart) {
      _setStartNode(coor);
    } else {
      _setFinishNode(coor);
    }
  };

  const visitedClassNames = [
    "bg-[#56cfe1]",
    "border-white",
    "motion-safe:animate-nodeVisitedAnimation",
  ];

  const shortestPathClassNames = ["bg-yellow-500"];

  const removeVisitedClassNames = (_nodes: INode[][]): void => {
    _nodes.flat().forEach((_node) => {
      const { col, row } = _node;
      const nodeId = getNodeId(col, row);
      nodesRef.current[nodeId]?.classList.remove(
        ...visitedClassNames,
        ...shortestPathClassNames
      );
    });
  };

  const animateShortestPath = (nodesInShortestPathOrder: INode[]): void => {
    setTimeout(() => {
      nodesInShortestPathOrder.forEach(({ col, row }, nodeIdx) => {
        setTimeout(() => {
          const nodeId = getNodeId(col, row);
          nodesRef.current[nodeId]?.classList.add(...shortestPathClassNames);
        }, ms * nodeIdx);
      });
    }, 500);
  };

  const animateAlgorithm = (
    sortedVisitedNodes: INode[],
    nodesInShortestPathOrder: INode[]
  ): void => {
    sortedVisitedNodes.forEach((node, nodeIdx) => {
      const { col, row, isStart, isFinish } = node;

      setTimeout(() => {
        const nodeId = getNodeId(col, row);
        nodesRef.current[nodeId]?.classList.add(...visitedClassNames);

        if (isStart) {
          setIsVisualizing(true);
        }
        if (isFinish) {
          setIsVisualizing(false);
          animateShortestPath(nodesInShortestPathOrder);
        }
      }, ms * nodeIdx);
    });
  };

  const visualizeAlgorithm = (): void => {
    removeVisitedClassNames(nodes);
    const startNode = nodes[_startNode[0]][_startNode[1]];
    const finishNode = nodes[_finishNode[0]][_finishNode[1]];
    const sortedVisitedNodes = dijkstra(nodes, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateAlgorithm(sortedVisitedNodes, nodesInShortestPathOrder);
  };

  const clearBoard = (): void => {
    const newNodes = generateEmptyGrid();
    setNodes(newNodes);
    removeVisitedClassNames(newNodes);
    _setStartNode(START_COOR);
    _setFinishNode(FINISH_COOR);
    setIsVisualizing(false);
  };

  useEffect(() => {
    document.addEventListener("dragover", (e) => e.preventDefault(), false);
  }, []);

  return (
    <div className="min-h-screen">
      <Nav
        visualizeAlgorithm={visualizeAlgorithm}
        disableButtons={isVisualizing}
        clearBoard={clearBoard}
      />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid my-8 place-content-center">
          <div className="shadow-lg">
            {nodes.map((col, colIdx) => (
              <div className="flex" key={colIdx}>
                {col.map((row, rowIdx) => {
                  const key = `${colIdx}-${rowIdx}`;

                  return (
                    <Node
                      key={key}
                      ref={(nodeEl) => {
                        nodesRef.current[key] = nodeEl;
                      }}
                      {...row}
                      _onDragStart={() => {
                        const _activeNode = row.isStart
                          ? "isStart"
                          : row.isFinish
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
                      onDrop={(e) => onDropSpecialNode(e, colIdx, rowIdx)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
