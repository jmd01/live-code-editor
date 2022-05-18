import React, { ReactNode } from "react";
import { TreeNode } from "../TreeNode";

export interface TreeNodeType {
  fullPath: string;
  pathSegment: string;
  key: string;
  title: ReactNode;
  children: TreeNodeType[];
}

type CreateNodeProps = {
  fullPath: string;
  splitPath: string[];
  tree: TreeNodeType[];
  index: number | string;
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
};

function createNode({
  fullPath,
  splitPath,
  tree,
  index,
  updateFileName,
  deleteFile,
}: CreateNodeProps): void {
  const pathSegment = splitPath.shift();

  const splitFullPath = fullPath.split("/");
  const segmentIdx = splitFullPath.indexOf(pathSegment ?? "");
  const pathToSegment = splitFullPath.slice(0, segmentIdx + 1).join("/");

  const idx = tree.findIndex((e: TreeNodeType) => {
    return e.pathSegment == pathSegment;
  });

  if (idx < 0) {
    const key = `${index}-0`;
    // console.log(
    //   "fullPath",
    //   fullPath,
    //   "pathToSegment",
    //   pathToSegment,
    //   "pathSegment",
    //   pathSegment
    // );
    pathSegment &&
      tree.push({
        fullPath: pathToSegment,
        pathSegment,
        title: (
          <TreeNode
            id={key}
            fullPath={fullPath}
            pathToSegment={pathToSegment}
            pathSegment={pathSegment}
            updateFileName={updateFileName}
            deleteFile={deleteFile}
          />
        ),
        key,
        children: [],
      });
    if (splitPath.length !== 0) {
      createNode({
        fullPath,
        splitPath,
        tree: tree[tree.length - 1].children,
        index: key,
        updateFileName,
        deleteFile,
      });
    }
  } else {
    createNode({
      fullPath,
      splitPath,
      tree: tree[idx].children,
      index: `${index}-${idx}`,
      updateFileName,
      deleteFile,
    });
  }
}

type PathListToTreeProps = {
  paths: string[];
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
};
export default function pathListToTree({
  paths,
  updateFileName,
  deleteFile,
}: PathListToTreeProps): TreeNodeType[] {
  const tree: TreeNodeType[] = [];
  for (let i = 0; i < paths.length; i++) {
    const fullPath: string = paths[i];
    const splitPath: string[] = fullPath.split("/");
    createNode({
      fullPath,
      splitPath,
      tree,
      index: i,
      updateFileName,
      deleteFile,
    });
  }

  return tree;
}
