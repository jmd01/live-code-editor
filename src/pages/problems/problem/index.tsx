// ** MUI Imports
import { Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Preview } from "../../../views/problem/Preview";
import { FileSystem } from "../../../views/problem/FileSystem";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";
import * as testingFileTrees from "./testingFileTrees";
import { useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useLocalStorage } from "react-use";

const withNoSSR = (Component: React.FunctionComponent) =>
  dynamic(() => Promise.resolve(Component), { ssr: false });

// export default withNoSSR;

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

const testingTree = testingFileTrees.tree;
const Problem = ({ id, userId }: { id: string; userId: string }) => {
  const theme = useTheme();

  const [tree, setTree] = useLocalStorage<FileNode[]>(
    `user:${userId}|problem:${id}`,
    testingTree ?? []
  );
  const [activeFile, setActiveFile] = useState<FileNode | undefined>(testingFileTrees.tree[5]);
  // const [editorValue, setEditorValue] = useState("");

  // useEffect(() => {
  //   setEditorValue(activeFile?.contents ?? "");
  // }, [activeFile]);

  const monaco = useMonaco();

  useEffect(() => {
    console.log("defineTheme");
    monaco?.editor.defineTheme("vs-modified", vsTheme);
    monaco?.editor.defineTheme("vs-dark-modified", vsDarkTheme);
  }, [monaco]);

  const onSelectFileSystemFile = (fileNode: FileNode) => {
    if (activeFile) {
      const updatedTree = (tree ?? [])?.map((fileNode) => {
        return fileNode.id === activeFile?.id
          ? {
              ...fileNode,
              contents: editorValue ?? "",
            }
          : fileNode;
      });
      console.log("tree", tree);
      console.log("activeFile", activeFile);
      console.log("updatedTree", updatedTree);
  
      setTree(updatedTree);
  
      // TODO store to BE
      // saveFile();
  
    }
    setActiveFile(fileNode);
  };

  const [editorValue, setEditorValue] = useState(activeFile?.contents);

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
            tree={tree ?? []}
            setTree={setTree}
            setActiveFile={onSelectFileSystemFile}
          />

          <Stack direction="row" height={"100%"} flexGrow={1}>
            {monaco && (
              <Box
                sx={{
                  height: "100%",
                  borderRight: `1px solid rgba(${theme.palette.customColors.main}, 0.12)`,
                  width: "50%",
                }}
              >
                <MonacoEditor
                  tree={tree ?? []}
                  monaco={monaco}
                  editorValue={editorValue}
                  setEditorValue={setEditorValue}
                  activeFile={activeFile}
                  setActiveFile={setActiveFile}

                />
              </Box>
            )}
            <Preview
              tree={tree ?? []}
              editorValue={editorValue}
              activeFile={activeFile}
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
export default withNoSSR(Problem);

const vsTheme: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#F4F5FA",
  },
};
const vsDarkTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#28243D",
  },
};
