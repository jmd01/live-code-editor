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
          if (file.path.startsWith(oldFilePath)) {
            console.log(
              "file.path",
              file.path,
              "oldFilePath",
              oldFilePath,
              "newFilePath",
              newFilePath,
              "path",
              file.path.replace(regex, newFilePath)
            );
          }
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
          id: "temp",
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

  console.log(treeifiedPaths);

  const onDragEnter: TreeProps["onDragEnter"] = ({ expandedKeys }) => {
    setExpandedKeys(expandedKeys);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log("drop", info);

    const dropNode = info.node;
    const dropPath = info.node.fullPath;
    const dropPathIsDir = !isLeaf(dropPath);

    const dragNode = info.dragNode;
    const dragPath = info.dragNode.fullPath;
    const dragPathIsDir = !isLeaf(dragPath);

    // console.log("dragPath", dragPath, "dropPath", dropPath);
    // console.log(
    //   "Path.dirname(dragPath)",
    //   Path.dirname(dragPath),
    //   "getDirectory(dropPath)",
    //   getDirectory(dropPath)
    // );

    // Dropping on or into it's own directory is a noop
    if (Path.dirname(dragPath) === getDirectory(dropPath)) {
      return;
    }

    const path = isLeaf(dropPath) ? getDirectory(dropPath) : dropPath;

    setExpandedKeys((keys) => (keys.includes(path) ? keys : [...keys, path]));

    const dragPathWithDelimiter = isLeaf(dragPath) ? dragPath : `${dragPath}/`;
    setTree((tree) => {
      // console.log(tree);

      return tree.reduce<FileNode[]>((acc, file) => {
        if (file.path.startsWith(dragPathWithDelimiter)) {
          console.log(
            "dragPath",
            dragPath,
            "file.path",
            file.path,
            "dropPath",
            dropPath
          );

          const regex = new RegExp(`${dragNode.pathSegment}.*$`);
          const updatedDropPath = file.path.match(regex)?.[0] ?? "";

          const updatedPath = `${getDropPathDirectory(
            dropNode
          )}/${updatedDropPath}`;

          // If the new file path already exists
          if (tree.some(({ path }) => path === updatedPath)) {
            // const uniquePath = getUniquePath(updatedPath, tree);
            return [
              ...acc,
              {
                ...file,
                path: updatedPath + "(1)",
              },
            ];
          } else {
            return [
              ...acc,
              {
                ...file,
                path: updatedPath,
              },
            ];
          }
        }
        return [...acc, file];
      }, []);
    });
  };

  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    // console.log("onExpand", expandedKeys);
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

const getDropPathDirectory = (dropNode: EventDataNode): string => {
  const dropPath = dropNode.fullPath;

  if (isLeaf(dropNode.pathSegment)) {
    console.log(
      "isLeaf",
      isLeaf(dropNode.pathSegment),
      "pathSegment:",
      dropNode.pathSegment,
      "dropPath",
      Path.dirname(dropPath)
    );
    return Path.dirname(dropPath);
    // const pathToParentDir = dropPath.match(/.*\//);
    // return pathToParentDir ? pathToParentDir[0] : "";
  }

  console.log(
    "isLeaf",
    isLeaf(dropNode.pathSegment),
    "pathSegment:",
    dropNode.pathSegment,
    "dropPath:",
    dropPath
  );
  return dropPath;
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
