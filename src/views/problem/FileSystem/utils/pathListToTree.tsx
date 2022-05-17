import React, { ReactNode } from "react";
import { TreeNode } from "../TreeNode";

export interface TreeNodeType {
  fullPath: string;
  pathSegment: string;
  key: string;
  title: ReactNode;
  children: TreeNodeType[];
}

function createNode(
  fullPath: string,
  splitPath: string[],
  tree: TreeNodeType[],
  index: number | string
): void {
  const pathSegment = splitPath.shift();

  const splitFullPath = fullPath.split("/");
  const segmentIdx = splitFullPath.indexOf(pathSegment ?? "");
  const pathToSegment = splitFullPath.slice(0, segmentIdx + 1).join("/");

  const idx = tree.findIndex((e: TreeNodeType) => {
    return e.pathSegment == pathSegment;
  });

  if (idx < 0) {
    const key = `${index}-0`;

    pathSegment &&
      tree.push({
        fullPath: pathToSegment,
        pathSegment,
        title: (
          <TreeNode
            id={key}
            title={pathSegment}
            updateNode={() => {
              console.log("updateNode");
            }}
          />
        ),
        key,
        children: [],
      });
    if (splitPath.length !== 0) {
      createNode(fullPath, splitPath, tree[tree.length - 1].children, key);
    }
  } else {
    createNode(fullPath, splitPath, tree[idx].children, `${index}-${idx}`);
  }
}

export default function pathListToTree(data: string[]): TreeNodeType[] {
  const tree: TreeNodeType[] = [];
  for (let i = 0; i < data.length; i++) {
    const path: string = data[i];
    const split: string[] = path.split("/");
    createNode(path, split, tree, i);
  }

  return tree;
}
