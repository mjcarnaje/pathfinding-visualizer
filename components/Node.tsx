import styles from "../styles/Node.module.css";
import { INode } from "../types/node.types";

const Node: React.FC<INode> = ({
  rowIdx,
  colIdx,
  isStart,
  isFinish,
  isWall,
}) => {
  return (
    <div
      id={`node-${rowIdx}-${colIdx}`}
      className={`${styles.node} ${
        isStart
          ? styles["node-start"]
          : isFinish
          ? styles["node-finish"]
          : isWall
          ? styles["node-wall"]
          : ""
      }`}
    ></div>
  );
};

export default Node;
