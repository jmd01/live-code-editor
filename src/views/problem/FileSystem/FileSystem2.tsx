import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { TreeProps } from "rc-tree";
import Tree from "rc-tree";

import "rc-tree/assets/index.css";
import { Folder, FolderOpen } from "mdi-material-ui";
import pathListToTree from "./utils/pathListToTree";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as Path from "path-browserify";
import type { DataNode, Key } from "rc-tree/lib/interface";
import type { TreeNodeProps } from "rc-tree/lib";
import type { EventDataNode } from "rc-tree/es/interface";
import { FileNode } from "../../../pages/problems/problem";
import { getDirectory, isLeaf } from "./utils/pathFns";

const STYLE = `
  .rc-tree-child-tree {
    display: block;
  }

  .rc-tree .rc-tree-treenode {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher {
    width: 20px;
    height: 20px;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher.rc-tree-switcher_open {
    background: none;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-switcher.rc-tree-switcher_close {
    background: none;
  }
  .rc-tree .rc-tree-treenode span.rc-tree-iconEle {
    width: 0;
    background: none;
  }
  .rc-tree-treenode-selected {
    background-color: #DADADAFF;
  }
  .rc-tree-node-selected {
    background: none;
    opacity: 1;
    box-shadow: none;
  }
  .rc-tree .rc-tree-treenode .rc-tree-node-content-wrapper {
    width: 100%;
  }
  .rc-tree-title {
    width: 100%;
    height: 24px;
    vertical-align: middle
  }
`;

declare module "rc-tree/es/interface" {
  interface EventDataNode {
    fullPath: string;
    pathSegment: string;
  }
}
declare module "rc-tree/lib/interface" {
  interface DataNode {
    fullPath: string;
    pathSegment: string;
  }
}

const FileSystem2 = ({
  tree,
  setTree,
}: {
  tree: FileNode[];
  setTree: Dispatch<SetStateAction<FileNode[]>>;
}) => {
  const theme = useTheme();

  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);

  const updateFileName = useCallback(
    (oldFilePath: string, newFilePath: string) => {
      setTree((tree) =>
        tree.map((file) => {
          const regex = new RegExp(`^${oldFilePath}`);
          return file.path.startsWith(oldFilePath)
            ? {
                ...file,
                path: file.path.replace(regex, newFilePath),
              }
            : file;
        })
      );
    },
    [setTree]
  );

  const deleteFile = useCallback(
    (filePath: string) => {
      setTree((tree) =>
        tree.reduce<FileNode[]>(
          (acc, file) =>
            file.path.startsWith(filePath) ? acc : [...acc, file],
          []
        )
      );
    },
    [setTree]
  );

  const addFile = useCallback(
    (pathToSegment: string, newFileName: string, isDir?: boolean) => {
      setTree((tree) => {
        const path = isLeaf(pathToSegment)
          ? getDirectory(pathToSegment)
          : pathToSegment;

        setExpandedKeys((keys) =>
          keys.includes(path) ? keys : [...keys, path]
        );

        const newNode: FileNode = {
          id: `temp-${path}/${newFileName}`, // TODO update this on save
          path: `${path}/${newFileName}`,
          isEmptyDir: isDir,
          contents: "",
        };

        const treeWithUpdatedParentDir = tree.map((file) => {
          return file.path === pathToSegment && file.isEmptyDir
            ? {
                ...file,
                isEmptyDir: undefined,
              }
            : file;
        });

        return [...treeWithUpdatedParentDir, newNode];
      });
    },
    [setTree]
  );

  const treeifiedPaths: DataNode[] = useMemo(() => {
    return pathListToTree({ tree, updateFileName, deleteFile, addFile });
  }, [tree, updateFileName, deleteFile, addFile]);

  const onDragEnter: TreeProps["onDragEnter"] = ({ expandedKeys }) => {
    setExpandedKeys(expandedKeys);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    const dropNode = info.node;
    const dropPath = info.node.fullPath;

    const dragNode = info.dragNode;
    const dragPath = info.dragNode.fullPath;

    // Dropping on or into it's own directory is a noop
    if (Path.dirname(dragPath) === getDirectory(dropPath)) {
      return;
    }

    const path = isLeaf(dropPath) ? getDirectory(dropPath) : dropPath;

    setExpandedKeys((keys) => (keys.includes(path) ? keys : [...keys, path]));

    const dragPathWithDelimiter = isLeaf(dragPath) ? dragPath : `${dragPath}/`;
    setTree((tree) =>
      tree.reduce<FileNode[]>((acc, file) => {
        const filePathWithDelimiter = isLeaf(file.path)
          ? file.path
          : `${file.path}/`;

        if (filePathWithDelimiter.startsWith(dragPathWithDelimiter)) {
          const filepathBelowDragPath = file.path.split(dragPath)?.[1] ?? "";
          const updatedDropPath = `${dragNode.pathSegment}${filepathBelowDragPath}`;

          const updatedPath = `${getDropPathDirectory(
            dropNode
          )}/${updatedDropPath}`;

          let updatedTree: FileNode[];

          // If the new file path already exists
          if (tree.some(({ path }) => path === updatedPath)) {
            // const uniquePath = getUniquePath(updatedPath, tree);
            updatedTree = [
              ...acc,
              {
                ...file,
                path: updatedPath + "(1)",
              },
            ];
          } else {
            updatedTree = [
              ...acc,
              {
                ...file,
                path: updatedPath,
              },
            ];
          }

          // If the parent dir is now empty it will disappear from the tree, so add an emptyDir
          const dragPathParent = Path.dirname(dragPath);

          if (
            dragPathParent !== "." && // Ignore root dirs
            !updatedTree.some(({ path }) => path.startsWith(dragPathParent))
          ) {
            console.log();
            updatedTree = [
              ...updatedTree,
              {
                id: `temp-${dragPathParent}`, // TODO update this on save
                path: dragPathParent,
                isEmptyDir: true,
                contents: "",
              },
            ];
          }

          return updatedTree;
        }
        return [...acc, file];
      }, [])
    );
  };

  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const switcherIcon = (obj: TreeNodeProps) => {
    if (!obj.isLeaf) {
      return obj.expanded ? (
        <FolderOpen fontSize="small" color={"primary"} />
      ) : (
        <Folder fontSize="small" color={"primary"} />
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "280px",
        borderWidth: 1,
        borderColor: `rgba(${theme.palette.customColors.main}, 0.12)`,
        borderStyle: "solid",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <Typography variant="h6">Files</Typography>

      <Tree
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        draggable
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={treeifiedPaths}
        switcherIcon={switcherIcon}
      />
    </Box>
  );
};
export default FileSystem2;

/**
 * If dropNode isLeaf, return path to parent dir otherwise return dropNode path
 */
const getDropPathDirectory = (dropNode: EventDataNode): string => {
  const dropPath = dropNode.fullPath;
  return isLeaf(dropNode.pathSegment) ? Path.dirname(dropPath) : dropPath;
};

/**
 * If leaf node, get parent dir, if dir then return itself
 */
const getUpdatedPath = (path: string) => {
  return isLeaf(path) ? Path.dirname(path) : path;
};

// const getUniquePath = (
//   updatedPath: string,
//   tree: Record<string, string>,
//   suffix = 1
// ): string => {
//   const filename = Path.basename()updatedPath;
// };
