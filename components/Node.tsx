import { forwardRef, HTMLAttributes } from "react";
import { INode } from "../types/node.types";

type Props = INode & HTMLAttributes<HTMLDivElement>;

const Node = forwardRef<HTMLDivElement, Props>(
  (
    { isStart, isFinish, isWall, onMouseDown, onMouseEnter, onMouseUp },
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
      <div
        ref={ref}
        className={`node ${extraClassNames}`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
      ></div>
    );
  }
);

export default Node;
