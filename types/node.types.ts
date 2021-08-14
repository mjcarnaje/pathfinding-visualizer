export type INode = {
    rowIdx: number;
    colIdx: number;
    distance: number,
    isStart: boolean;
    isFinish: boolean;
    isVisited: boolean;
    isWall: boolean;
    previousNode: null | INode;
  };