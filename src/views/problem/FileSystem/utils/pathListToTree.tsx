import React, { ReactNode } from "react";
import { TreeNode } from "../TreeNode";

export interface TreeNodeType {
  pathSegment: string;
  key: string;
  title: ReactNode;
  children: TreeNodeType[];
}

function createNode(
  path: string[],
  tree: TreeNodeType[],
  index: number | string
): void {
  console.log("path", path);
  const pathSegment = path.shift();
  const idx = tree.findIndex((e: TreeNodeType) => {
    return e.pathSegment == pathSegment;
  });
  if (idx < 0) {
    const key = `${index}-0`;

    pathSegment &&
      tree.push({
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
    if (path.length !== 0) {
      createNode(path, tree[tree.length - 1].children, key);
    }
  } else {
    createNode(path, tree[idx].children, `${index}-${idx}`);
  }
}

export default function pathListToTree(data: string[]): TreeNodeType[] {
  const tree: TreeNodeType[] = [];
  for (let i = 0; i < data.length; i++) {
    const path: string = data[i];
    const split: string[] = path.split("/");
    createNode(split, tree, i);
  }

  return tree;
}
