import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
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
  tree: Record<string, string>;
  setTree: Dispatch<SetStateAction<Record<string, string>>>;
}) => {
  const theme = useTheme();
  const paths = useMemo(() => Object.keys(tree), [tree]);

  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([
    "0-0-key",
    "0-0-0-key",
    "0-0-0-0-key",
  ]);

  const treeifiedPaths: DataNode[] = useMemo(() => {
    return pathListToTree(paths);
  }, [paths]);
  // console.log(treeifiedPaths);

  const onDragEnter: TreeProps["onDragEnter"] = ({ expandedKeys }) => {
    // console.log("enter", expandedKeys);
    setExpandedKeys(expandedKeys);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log("drop", info);

    const dropNode = info.node;
    const dropPath = info.node.fullPath;

    // const dropPath = info.node.children && info.node.children.length > 0 ? info.node.fullPath : ;

    const dragNode = info.dragNode;
    const dragPath = info.dragNode.fullPath;

    // console.log(dropPath, dragPath);

    // Dropping on or into it's own directory is a noop
    if (getDirectory(dragPath) === getDirectory(dropPath)) {
      return;
    }

    setTree((tree) => {
      // console.log(tree);

      let updatedTree = {};
      for (const path in tree) {
        if (path.startsWith(dragPath)) {
          console.log(dragPath, path, dropPath);

          // lib/index.ts >> util/lib/index.ts
          // foo/lib/index.ts >> util/foo/lib/index.ts
          // foo/lib/index.ts >> util/lib/index.ts

          const updatedPath2 = isLeaf(path) ? dragNode.pathSegment : dragPath;
          const regex = new RegExp(`${dragNode.pathSegment}.*$`);
          const updatedPath3 = path.match(regex)?.[0] ?? "";

          const updatedPath = `${getDropPathDirectory(
            dropNode
          )}/${updatedPath3}`;

          // If the new file path already exists
          if (tree[updatedPath]) {
            // const uniquePath = getUniquePath(updatedPath, tree);
            updatedTree = {
              ...updatedTree,
              [updatedPath + "(1)"]: tree[path],
            };
          } else {
            updatedTree = {
              ...updatedTree,
              [updatedPath]: tree[path],
            };
          }
        } else {
          updatedTree = {
            ...updatedTree,
            [path]: tree[path],
          };
        }
      }

      console.log("updatedTree", updatedTree);

      return updatedTree;
    });
  };

  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    console.log("onExpand", expandedKeys);
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

const isLeaf = (path: string): boolean => {
  // console.log(node.pathSegment, Path.extname(node.pathSegment));

  return !!Path.extname(path);
};

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

/**
 * If leaf node, get parent dir, if dir then return itself
 */
const getDirectory = (path: string) => {
  return isLeaf(path) ? Path.dirname(path) : path;
};

// const getUniquePath = (
//   updatedPath: string,
//   tree: Record<string, string>,
//   suffix = 1
// ): string => {
//   const filename = Path.basename()updatedPath;
// };
