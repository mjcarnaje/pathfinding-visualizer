import { forwardRef, HTMLAttributes } from "react";
import { INode } from "../types/node.types";

type Props = INode & HTMLAttributes<HTMLDivElement>;

const Node = forwardRef<HTMLDivElement, Props>(
  (
    {
      col,
      row,
      isStart,
      isFinish,
      isWall,
      isVisited,
      distance,
      previousNode,
      ...divEl
    },
    ref
  ) => {
    const extraClassNames = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div ref={ref} className={`node ${extraClassNames}`} {...divEl}></div>
    );
  }
);

export default Node;
