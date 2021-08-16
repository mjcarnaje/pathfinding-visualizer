export type INode = {
  row: number;
  col: number;
  distance: number;
  isStart: boolean;
  isFinish: boolean;
  isVisited: boolean;
  isWall: boolean;
  previousNode: null | INode;
};
