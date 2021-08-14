import { forwardRef } from "react";
import { INode } from "../types/node.types";

const Node = forwardRef<HTMLDivElement, INode>(
  ({ isStart, isFinish, isWall }, ref) => {
    const extraClassNames = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : isWall
      ? "node-wall"
      : "";

    return <div ref={ref} className={`node ${extraClassNames}`}></div>;
  }
);

export default Node;
