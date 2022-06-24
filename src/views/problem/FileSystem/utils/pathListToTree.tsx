import React, { ReactNode } from "react";
import { TreeNode } from "../TreeNode";
import { FileNode } from "../../../../pages/problems/FileNode";
import { Key } from "rc-tree/lib/interface";

export interface TreeNodeType {
  fullPath: string;
  pathSegment: string;
  key: string;
  title: ReactNode;
  children: TreeNodeType[];
  isLeaf?: boolean;
}

type CreateNodeProps = {
  fileNode: FileNode;
  fullPath: string;
  splitPath: string[];
  isEmptyDir: boolean | undefined;
  tree: TreeNodeType[];
  index: number | string;
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
  addFile: (pathToSegment: string, newFileName: string) => void;
  setActiveFile: (value: FileNode) => void;
  setExpandedKeys: (value: (keys: Key[]) => Key[]) => void;
};

function createNode({
  fileNode,
  fullPath,
  splitPath,
  isEmptyDir,
  tree,
  index,
  updateFileName,
  deleteFile,
  addFile,
  setActiveFile,
  setExpandedKeys,
}: CreateNodeProps): void {
  const pathSegment = splitPath.shift();

  const splitFullPath = fullPath.split("/");
  const depth = index.toString().split("-");
  const pathToSegment = splitFullPath.slice(0, depth.length).join("/");

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
            fileNode={fileNode}
            pathToSegment={pathToSegment}
            pathSegment={pathSegment}
            updateFileName={updateFileName}
            deleteFile={deleteFile}
            addFile={addFile}
            setActiveFile={setActiveFile}
            setExpandedKeys={setExpandedKeys}
          />
        ),
        key: pathToSegment,
        children: [],
        isLeaf:
          typeof isEmptyDir === "boolean" && isEmptyDir ? false : undefined,
      });
    if (splitPath.length !== 0) {
      createNode({
        fileNode,
        fullPath,
        splitPath,
        isEmptyDir,
        tree: tree[tree.length - 1].children,
        index: key,
        updateFileName,
        deleteFile,
        addFile,
        setActiveFile,
        setExpandedKeys,
      });
    }
  } else {
    createNode({
      fileNode,
      fullPath,
      splitPath,
      isEmptyDir,
      tree: tree[idx].children,
      index: `${index}-${idx}`,
      updateFileName,
      deleteFile,
      addFile,
      setActiveFile,
      setExpandedKeys,
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
  setActiveFile: (value: FileNode) => void;
  setExpandedKeys: (value: (keys: Key[]) => Key[]) => void;
};
export default function pathListToTree({
  tree,
  updateFileName,
  deleteFile,
  addFile,
  setActiveFile,
  setExpandedKeys,
}: PathListToTreeProps): TreeNodeType[] {
  const treeNodes: TreeNodeType[] = [];
  for (let i = 0; i < tree.length; i++) {
    const fileNode = tree[i];
    const isEmptyDir = fileNode.isEmptyDir;
    const fullPath: string = fileNode.path;
    const splitPath: string[] = fullPath.split("/");
    createNode({
      fileNode,
      fullPath,
      splitPath,
      isEmptyDir,
      tree: treeNodes,
      index: i,
      updateFileName,
      deleteFile,
      addFile,
      setActiveFile,
      setExpandedKeys,
    });
  }

  return treeNodes;
}
