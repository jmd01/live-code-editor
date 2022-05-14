import React, { useMemo, useState } from "react";
import Tree, { TreeNodeProps } from "rc-tree";

import { DataNode, Key } from "rc-tree/lib/interface";
import { TreeProps } from "rc-tree/es/Tree";

import "rc-tree/assets/index.css";
import { Folder, FolderOpen } from "mdi-material-ui";
import pathListToTree from "./utils/pathListToTree";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// const initialData: DataNode[] = [
//   {
//     title: <TreeNode id={"0-0-key"} title={"0-0-label"} />,
//     key: "0-0-key",
//     children: [
//       {
//         title: "0-0-0-label",
//         key: "0-0-0-key",
//         children: [
//           {
//             title: "0-0-0-0-label",
//             key: "0-0-0-0-key",
//           },
//           {
//             title: "0-0-0-1-label",
//             key: "0-0-0-1-key",
//           },
//           {
//             title: "0-0-0-2-label",
//             key: "0-0-0-2-key",
//           },
//         ],
//       },
//       {
//         title: "0-0-1-label",
//         key: "0-0-1-key",
//         children: [
//           {
//             title: "0-0-1-0-label",
//             key: "0-0-1-0-key",
//           },
//           {
//             title: "0-0-1-1-label",
//             key: "0-0-1-1-key",
//           },
//           {
//             title: "0-0-1-2-label",
//             key: "0-0-1-2-key",
//           },
//         ],
//       },
//       {
//         title: "0-0-2-label",
//         key: "0-0-2-key",
//       },
//     ],
//   },
//   {
//     title: "0-1-label",
//     key: "0-1-key",
//     children: [
//       {
//         title: "0-1-0-label",
//         key: "0-1-0-key",
//         children: [
//           {
//             title: "0-1-0-0-label",
//             key: "0-1-0-0-key",
//           },
//           {
//             title: "0-1-0-1-label",
//             key: "0-1-0-1-key",
//           },
//           {
//             title: "0-1-0-2-label",
//             key: "0-1-0-2-key",
//           },
//         ],
//       },
//       {
//         title: "0-1-1-label",
//         key: "0-1-1-key",
//         children: [
//           {
//             title: "0-1-1-0-label",
//             key: "0-1-1-0-key",
//           },
//           {
//             title: "0-1-1-1-label",
//             key: "0-1-1-1-key",
//           },
//           {
//             title: "0-1-1-2-label",
//             key: "0-1-1-2-key",
//           },
//         ],
//       },
//       {
//         title: "0-1-2-label",
//         key: "0-1-2-key",
//       },
//     ],
//   },
//   {
//     title: "0-2-label",
//     key: "0-2-key",
//   },
// ];

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

// const gData = [
//   { title: '0-0', key: '0-0' },
//   { title: '0-1', key: '0-1' },
//   { title: '0-2', key: '0-2', children: [{ title: '0-2-0', key: '0-2-0' }] },
// ];

// const tree = {
//   "util/encode.ts": `
//
//         export function encode(data: string): Uint8Array {
//
//             return new Uint8Array(1)
//         }
//     `,
//   "lib/foo.ts": `
//
//         import { encode } from '../util/encode.ts'
//
//         export function foo() {
//
//            return encode('foo')
//         }
//     `,
//   "lib/bar.ts": `
//
//         import { encode } from '../util/encode.ts'
//
//         export function bar() {
//
//            return encode('bar')
//         }
//     `,
//   "lib/index.ts": `
//
//         export * from './foo.ts'
//
//         export * from './bar.ts'
//     `,
//   "index.ts": `
//         //import * as React from "react"
//         import { foo, bar } from './lib/index.ts'
//
//         console.log(foo());
//
//         console.log(bar());
//     `,
// };
//
// const paths = Object.keys(tree);

const FileSystem2 = ({
  tree,
  setTree,
}: {
  tree: Record<string, string>;
  setTree: (tree: Record<string, string>) => void;
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
  console.log(treeifiedPaths);

  const onDragEnter: TreeProps["onDragEnter"] = ({ expandedKeys }) => {
    console.log("enter", expandedKeys);
    setExpandedKeys(expandedKeys);
  };

  const onDrop: TreeProps["onDrop"] = (info) => {
    console.log("drop", info);
    const dropKey = info.node.key.toString();
    const dragKey = info.dragNode.key.toString();
    const dropPos = info.node.pos.split("-");
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: string,
      callback: (item: DataNode, index: number, arr: DataNode[]) => void
    ) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          callback(item, index, arr);

          return;
        }
        if (item.children) {
          loop(item.children, key, callback);
        }
      });
    };
    const data = [...treeifiedPaths];

    // Find dragObject
    let dragObj!: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];

        // where to insert
        item.children.push(dragObj);
      });
    } else if (
      (info.node.children || []).length > 0 && // Has children
      info.node.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];

        // where to insert
        item.children.unshift(dragObj);
      });
    } else {
      // Drop on the gap
      let ar!: DataNode[];
      let i!: number;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar && ar.splice(i + 1, 0, dragObj);
      }
    }

    // TODO
    // setTree([]);
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

// type MyDataNode = DataNode & {
//   pathSegment: string;
// };
// const pathsToTree = (paths: string[]): MyDataNode[] => {
//   const result: MyDataNode[] = [];
//   const level: { result: MyDataNode[] } = {
//     result,
//   };
//
//   paths.forEach((path, index) => {
//     path.split("/").reduce((r, pathSegment, index2) => {
//       if (!(pathSegment in r)) {
//         r = {
//           ...r,
//           [pathSegment]: { result: [] },
//         };
//         const key = `${index}-${index2}`;
//
//         // @ts-ignore
//         const pathSegmentObj = r[pathSegment];
//         r.result.push({
//           key,
//           title: (
//             <TreeNode id={key} title={pathSegment} updateNode={() => {}} />
//           ),
//           pathSegment,
//           children: pathSegmentObj.result,
//         });
//         return pathSegmentObj;
//       }
//     }, level);
//   });
//
//   return result;
// };
//
// const isMyDataNode = (
//   value: MyDataNode | { result: MyDataNode[] }
// ): value is MyDataNode => "pathSegment" in value;
