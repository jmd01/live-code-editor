// ** MUI Imports
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Preview from "../../../views/problem/Preview";
import FileSystem from "../../../views/problem/FileSystem/FileSystem";
import { useState } from "react";

import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import * as testingFileTrees from "./testingFileTrees";

const MonacoEditor = dynamic(
  () => import("../../../views/problem/MonacoEditor"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

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
  const theme = useTheme();

  const [tree, setTree] = useState<FileNode[]>(
    testingFileTrees.simpleTsTreeNoExtension
  );
  const [activeFile, setActiveFile] = useState<FileNode>();

  return (
    <Grid container spacing={6} height={"100%"}>
      {/*<Grid item xs={12}>*/}
      {/*  <Typography variant="h5">{problemData.name}</Typography>*/}
      {/*  <Typography variant="body2">{problemData.description}</Typography>*/}
      {/*</Grid>*/}
      <Grid item xs={12} height={"100%"}>
        <Stack
          direction="row"
          height={"100%"}
          sx={{
            borderWidth: 1,
            borderColor: `rgba(${theme.palette.customColors.main}, 0.12)`,
            borderStyle: "solid",
          }}
        >
          <FileSystem
            tree={tree}
            setTree={setTree}
            setActiveFile={setActiveFile}
          />
          <Stack direction="row" height={"100%"} flexGrow={1}>
            <MonacoEditor file={activeFile} tree={tree} />
            <Preview />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default Problem;
