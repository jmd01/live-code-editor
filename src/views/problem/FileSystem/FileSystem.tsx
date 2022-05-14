import { ReactNode, useEffect, useMemo, useState } from "react";
import { TreeItem, TreeView } from "@mui/lab";
import { ChevronDown, ChevronRight } from "mdi-material-ui";
import { Stack } from "@mui/material";
import { MuiDraggableTreeView, TreeNode } from "mui-draggable-treeview";

const tree = {
  "util/encode.ts": `

        export function encode(data: string): Uint8Array {
            
            return new Uint8Array(1)
        } 
    `,
  "lib/foo.ts": `
        
        import { encode } from '../util/encode.ts'
        
        export function foo() {
                
           return encode('foo')
        }
    `,
  "lib/bar.ts": `
        
        import { encode } from '../util/encode.ts'

        export function bar() {

           return encode('bar')
        }
    `,
  "lib/index.ts": `
    
        export * from './foo.ts'

        export * from './bar.ts'
    `,
  "index.ts": `
        //import * as React from "react"
        import { foo, bar } from './lib/index.ts'

        console.log(foo());

        console.log(bar());
    `,
};

const paths = Object.keys(tree);

const FileSystem = () => {
  const treeifiedPaths: RenderTree[] = useMemo(() => {
    return pathsToTree(paths);
  }, []);
  console.log(treeifiedPaths);

  // useEffect(() => {}, [treeifiedPaths]);
  // const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  //
  // const treeifiedNodeIds = (nodes: RenderTree): ReactNode => {
  //   nodes.name === "root" && nodes.children ? (
  //     nodes.children.map((node) => renderTree(node))
  //   ) : (
  //     <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
  //       {nodes.children ? nodes.children.map((node) => renderTree(node)) : null}
  //     </TreeItem>
  //   );
  // };

  const renderTree = (nodes: RenderTree[]): ReactNode =>
    nodes.map((node) => (
      <TreeItem key={node.id} nodeId={node.id} label={node.name}>
        {node.children ? renderTree(node.children) : null}
      </TreeItem>
    ));

  return (
    <Stack direction={"column"}>
      <h4>Files</h4>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ChevronDown />}
        defaultExpandIcon={<ChevronRight />}
        sx={{ height: "100%", flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
      >
        {renderTree(treeifiedPaths)}
      </TreeView>
    </Stack>
  );
};

export default FileSystem;

interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
}

const pathsToTree = (paths: string[]): RenderTree[] => {
  const result: RenderTree[] = [];
  const level = { result };

  paths.forEach((path, index) => {
    path.split("/").reduce((r, name, index2) => {
      if (!r[name]) {
        r[name] = { result: [] };
        r.result.push({
          id: `${index}_${index2}`,
          name,
          children: r[name].result,
        });
      }

      return r[name];
    }, level);
  });

  return result;
};
