import React, { ReactNode } from "react";
import { TreeNode } from "../TreeNode";
import { FileNode } from "../../../../pages/problems/problem";

export interface TreeNodeType {
  fullPath: string;
  pathSegment: string;
  key: string;
  title: ReactNode;
  children: TreeNodeType[];
  isLeaf?: boolean;
}

type CreateNodeProps = {
  fullPath: string;
  splitPath: string[];
  isEmptyDir: boolean | undefined;
  tree: TreeNodeType[];
  index: number | string;
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
  addFile: (pathToSegment: string, newFileName: string) => void;
};

function createNode({
  fullPath,
  splitPath,
  isEmptyDir,
  tree,
  index,
  updateFileName,
  deleteFile,
  addFile,
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
    pathSegment &&
      tree.push({
        fullPath: pathToSegment,
        pathSegment,
        title: (
          <TreeNode
            id={pathToSegment}
            fullPath={fullPath}
            pathToSegment={pathToSegment}
            pathSegment={pathSegment}
            updateFileName={updateFileName}
            deleteFile={deleteFile}
            addFile={addFile}
          />
        ),
        key: pathToSegment,
        children: [],
        isLeaf:
          typeof isEmptyDir === "boolean" && isEmptyDir ? false : undefined,
      });
    if (splitPath.length !== 0) {
      createNode({
        fullPath,
        splitPath,
        isEmptyDir,
        tree: tree[tree.length - 1].children,
        index: key,
        updateFileName,
        deleteFile,
        addFile,
      });
    }
  } else {
    createNode({
      fullPath,
      splitPath,
      isEmptyDir,
      tree: tree[idx].children,
      index: `${index}-${idx}`,
      updateFileName,
      deleteFile,
      addFile,
    });
  }
}

type PathListToTreeProps = {
  tree: FileNode[];
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
  addFile: (
    pathToSegment: string,
    newFileName: string,
    isDir?: boolean
  ) => void;
};
export default function pathListToTree({
  tree,
  updateFileName,
  deleteFile,
  addFile,
}: PathListToTreeProps): TreeNodeType[] {
  const treeNodes: TreeNodeType[] = [];
  for (let i = 0; i < tree.length; i++) {
    const fileNode = tree[i];
    const isEmptyDir = fileNode.isEmptyDir;
    const fullPath: string = fileNode.path;
    const splitPath: string[] = fullPath.split("/");
    createNode({
      fullPath,
      splitPath,
      isEmptyDir,
      tree: treeNodes,
      index: i,
      updateFileName,
      deleteFile,
      addFile,
    });
  }

  return treeNodes;
}
