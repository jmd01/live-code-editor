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

const Problem = ({ id }: { id: string }) => {
  console.log(id);

  const [tree, setTree] = useState<Record<string, string>>({
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
    "fooz/barz/index.ts": `
    
        export * from './foo.ts'

        export * from './bar.ts'
    `,
    "fooz/foooooz.ts": `
    
        export * from './foo.ts'

        export * from './bar.ts'
    `,
    "index.ts": `
        //import * as React from "react"
        import { foo, bar } from './lib/index.ts'

        console.log(foo());

        console.log(bar());
    `,
  });

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
