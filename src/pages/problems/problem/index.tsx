// ** MUI Imports
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Editor from "../../../views/problem/Editor";
import Preview from "../../../views/problem/Preview";
import FileSystem2 from "../../../views/problem/FileSystem/FileSystem2";
import { useState } from "react";

const problemData = {
  id: "1",
  name: "Create a Tic Tac Toe game",
  description:
    "Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description",
  attempted: false,
  time: 999,
  locked: false,
};

export type FileNode = {
  id: string;
  path: string;
  contents: string;
  isEmptyDir?: boolean;
};

const Problem = ({ id }: { id: string }) => {
  console.log(id);

  const [tree, setTree] = useState<FileNode[]>([
    {
      id: "1",
      path: "util/encode.ts",
      contents: `

        export function encode(data: string): Uint8Array {

            return new Uint8Array(1)
        }
    `,
    },
    {
      id: "2",
      path: "lib/foo.ts",
      contents: `

      import { encode } from '../util/encode.ts'

      export function foo() {

         return encode('foo')
      }
  `,
    },
    {
      id: "3",
      path: "lib/bar.ts",
      contents: `

      import { encode } from '../util/encode.ts'

      export function bar() {

         return encode('bar')
      }
  `,
    },
    {
      id: "4",
      path: "lib/index.ts",
      contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
    },
    {
      id: "5",
      path: "fooz/barz/index.ts",
      contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
    },
    {
      id: "6",
      path: "fooz/foooooz.ts",
      contents: `

      export * from './foo.ts'

      export * from './bar.ts'
  `,
    },
    {
      id: "7",
      path: "index.ts",
      contents: `
      //import * as React from "react"
      import { foo, bar } from './lib/index.ts'

      console.log(foo());

      console.log(bar());
  `,
    },
    {
      id: "8",
      path: "foo/bar",
      isEmptyDir: true,
      contents: ``,
    },
    {
      id: "9",
      path: "x/x.ts",
      contents: ``,
    },
    {
      id: "10",
      path: "x/y/y.ts",
      contents: ``,
    },
    {
      id: "11",
      path: "x/y/z/z.ts",
      contents: ``,
    },
    {
      id: "12",
      path: "xx/x/x.ts",
      contents: ``,
    },
    {
      id: "13",
      path: "xx/x/y/y.ts",
      contents: ``,
    },
    {
      id: "14",
      path: "xx/x/y/z/z.ts",
      contents: ``,
    },
  ]);
  // const [tree, setTree] = useState<FileNode[]>([
  //   {
  //     id: "1",
  //     path: "util/encode.ts",
  //     contents:
  //       "\n\n        export function encode(data: string): Uint8Array {\n            \n            return new Uint8Array(1)\n        } \n    ",
  //   },
  //   {
  //     id: "2",
  //     path: "lib/foo.ts",
  //     contents:
  //       "\n\n      import { encode } from '../util/encode.ts'\n\n      export function foo() {\n\n         return encode('foo')\n      }\n  ",
  //   },
  //   {
  //     id: "3",
  //     path: "lib/bar.ts",
  //     contents:
  //       "\n\n      import { encode } from '../util/encode.ts'\n\n      export function bar() {\n\n         return encode('bar')\n      }\n  ",
  //   },
  //   {
  //     id: "4",
  //     path: "lib/index.ts",
  //     contents:
  //       "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  //   },
  //   {
  //     id: "5",
  //     path: "fooz/barz/index.ts",
  //     contents:
  //       "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  //   },
  //   {
  //     id: "6",
  //     path: "fooz/foooooz.ts",
  //     contents:
  //       "\n\n      export * from './foo.ts'\n\n      export * from './bar.ts'\n  ",
  //   },
  //   {
  //     id: "7",
  //     path: "index.ts",
  //     contents:
  //       "\n      //import * as React from \"react\"\n      import { foo, bar } from './lib/index.ts'\n\n      console.log(foo());\n\n      console.log(bar());\n  ",
  //   },
  //   {
  //     id: "8",
  //     path: "foo/bar",
  //     isEmptyDir: true,
  //     contents: "",
  //   },
  //   // {
  //   //   id: "9",
  //   //   path: "x/x.ts",
  //   //   contents: "",
  //   // },
  //   // {
  //   //   id: "10",
  //   //   path: "x/y/y.ts",
  //   //   contents: "",
  //   // },
  //   // {
  //   //   id: "11",
  //   //   path: "x/y/z/z.ts",
  //   //   contents: "",
  //   // },
  //   {
  //     id: "12",
  //     path: "x/y/x/x.ts",
  //     contents: "",
  //   },
  //   // {
  //   //   id: "13",
  //   //   path: "x/y/x/y/y.ts",
  //   //   contents: "",
  //   // },
  //   // {
  //   //   id: "14",
  //   //   path: "x/y/x/y/z/z.ts",
  //   //   contents: "",
  //   // },
  // ]);

  return (
    <Grid container spacing={6} height={"100%"}>
      {/*<Grid item xs={12}>*/}
      {/*  <Typography variant="h5">{problemData.name}</Typography>*/}
      {/*  <Typography variant="body2">{problemData.description}</Typography>*/}
      {/*</Grid>*/}
      <Grid item xs={12} height={"100%"}>
        <Stack direction="row" height={"100%"}>
          <FileSystem2 tree={tree} setTree={setTree} />
          <Editor />
          <Preview />
        </Stack>
      </Grid>
    </Grid>
  );
};
export default Problem;
