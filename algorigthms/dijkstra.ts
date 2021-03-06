import { INode } from "../types/node.types";

function sortNodesByDistance(unvisitedNodes: INode[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(closestNode: INode, nodes: INode[][]) {
  const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, nodes);

  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = closestNode.distance + 1;
    neighbor.previousNode = closestNode;
  }

  return unvisitedNeighbors;
}

function getUnvisitedNeighbors(closestNode: INode, nodes: INode[][]) {
  const neighbors = [];

  const { col, row } = closestNode;

  if (col > 0) neighbors.push(nodes[col - 1][row]);
  if (col < nodes.length - 1) neighbors.push(nodes[col + 1][row]);
  if (row > 0) neighbors.push(nodes[col][row - 1]);
  if (row < nodes[0].length - 1) neighbors.push(nodes[col][row + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function dijkstra(
  nodes: INode[][],
  startNode: INode,
  finishNode: INode
): INode[] {
  const visitedNodesInOrder: INode[] = [];

  startNode.distance = 0;

  const unVisitedNodes = nodes.flat();

  // IF THERE ARE STILL UNVISITED NODE/s
  while (!!unVisitedNodes.length) {
    sortNodesByDistance(unVisitedNodes);
    // GET THE FIRST NODE AND REMOVE IT FROM THE ARRAY
    const closestNode = unVisitedNodes.shift()!;
    // IF WE ENCOUNTER A WALL, SKIP IT
    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    // THE NODE GOT VISITED
    closestNode.isVisited = true;
    // ADD THE NODE TO THE VISITED NODES ARRAY
    visitedNodesInOrder.push(closestNode);
    // IF THE FINISH NODE IS FOUND THEN RETURN THE VISITED NODES ARRAY
    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, nodes);
  }

  return visitedNodesInOrder;
}

export function getNodesInShortestPathOrder(finishNode: INode | null): INode[] {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;

  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }

  return nodesInShortestPathOrder;
}
