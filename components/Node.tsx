import styles from "../styles/Node.module.css";

interface Props {
  colIdx: number;
  rowIdx: number;
  isStart: boolean;
  isFinish: boolean;
}

const Node: React.FC<Props> = ({ colIdx, rowIdx, isStart, isFinish }) => {
  console.log(isStart);

  return (
    <div
      className={`${styles.node} ${
        isStart
          ? styles["node-start"]
          : isFinish
          ? styles["node-finish"]
          : styles["node-wall"]
      }`}
    ></div>
  );
};

export default Node;
