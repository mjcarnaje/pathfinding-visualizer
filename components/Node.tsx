import { forwardRef, TdHTMLAttributes } from "react";
import { INode } from "../types/node.types";
import { classNames } from "../utils";

type Props = { onDragStartSpecialNode: () => void } & INode &
  TdHTMLAttributes<HTMLTableDataCellElement>;

export const defaultNodeClassName =
  "w-6 h-6 inline-flex justify-center place-items-center border border-blue-300";

const Node = forwardRef<HTMLTableDataCellElement, Props>(
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
      onDragStartSpecialNode,
      ...divEl
    },
    ref
  ) => {
    return (
      <td
        ref={ref}
        className={classNames(
          isStart ? "" : isFinish ? "" : isWall ? "bg-gray-500" : "",
          defaultNodeClassName
        )}
        {...divEl}
      >
        {isStart && (
          <div draggable={true} onDragStart={onDragStartSpecialNode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {isFinish && (
          <div draggable={true} onDragStart={onDragStartSpecialNode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </td>
    );
  }
);

export default Node;
