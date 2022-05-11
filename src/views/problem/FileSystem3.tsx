import React, { useState } from "react";
import { gData as initialData } from "./utils/dataUtil";
import Tree from "rc-tree";

import { Key } from "rc-tree/lib/interface";
import { TreeProps } from "rc-tree/es/Tree";

import "rc-tree/assets/index.css";
import "./FileSystem2.module.css";

const STYLE = `
.rc-tree-child-tree {
  display: block;
}

.node-motion {
  transition: all .3s;
  overflow-y: hidden;
}
`;

// Animate directory open/close
const motion = {
  motionName: "node-motion",
  motionAppear: false,
  onAppearStart: () => {
    return { height: 0 };
  },
  onAppearActive: (node: HTMLElement) => ({ height: node.scrollHeight }),
  onLeaveStart: (node: HTMLElement) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0 }),
};

// const gData = [
//   { title: '0-0', key: '0-0' },
//   { title: '0-1', key: '0-1' },
//   { title: '0-2', key: '0-2', children: [{ title: '0-2-0', key: '0-2-0' }] },
// ];

type Item = {
  title: string;
  key: string;
  children?: Item[];
};

const FileSystem3 = () => {
  const [gData, setGData] = useState(initialData);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([
    "0-0-key",
    "0-0-0-key",
    "0-0-0-0-key",
  ]);

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
      data: Item[],
      key: string,
      callback: (item: Item, index: number, arr: Item[]) => void
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
    const data = [...gData];

    // Find dragObject
    let dragObj!: Item;
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
      let ar!: Item[];
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

    setGData(data);
  };

  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    console.log("onExpand", expandedKeys);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  return (
    <div className="draggable-demo">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <h2>draggable</h2>
      <p>drag a node into another node</p>
      <Tree
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        draggable
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
        motion={motion}
      />
    </div>
  );
};

export default FileSystem3;
