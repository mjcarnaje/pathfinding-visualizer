import { ICoor } from "../types";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getNodeId = (col: number, row: number) => {
  return `${col}-${row}`;
};

export const isEqual = (a: ICoor, b: ICoor) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
