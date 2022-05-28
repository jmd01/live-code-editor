import Editor, { EditorProps, useMonaco } from "@monaco-editor/react";
import * as Path from "path-browserify";
import React, { useEffect, useState } from "react";
import { editor } from "monaco-editor";
import { FileNode } from "src/pages/problems/problem";
import { useTheme } from "@mui/material/styles";
import { useSettings } from "../../../@core/hooks/useSettings";
import { Box } from "@mui/material";

type MonacoEditorProps = {
  file: FileNode | undefined;
};
const MonacoEditor = ({ file }: MonacoEditorProps) => {
  const theme = useTheme();
  const monaco = useMonaco();
  const { settings } = useSettings();

  console.log("settings.mode", settings.mode);

  const [value, setValue] = useState(file?.contents);
  const [language, setLanguage] = useState(getLanguage(file?.path));
  const [minimap, setMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] =
    useState<editor.IEditorOptions["wordWrap"]>("off");

  useEffect(() => {
    setValue(file?.contents);
    setLanguage(getLanguage(file?.path));
  }, [file]);

  useEffect(() => {
    monaco?.editor.defineTheme("vs-modified", vsTheme);
    monaco?.editor.defineTheme("vs-dark-modified", vsDarkTheme);
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }, [monaco]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(
        settings.mode === "light" ? "vs-modified" : "vs-dark-modified"
      );
    }
  }, [monaco, settings.mode]);

  return (
    <Box
      sx={{
        height: "100%",
        borderRight: `1px solid rgba(${theme.palette.customColors.main}, 0.12)`,
        width: "50%",
      }}
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        onChange={(value) => setValue(value)}
        value={value}
        options={{
          padding: {
            top: 8,
          },
          minimap: {
            enabled: minimap,
          },
          fontSize,
          wordWrap,
          tabSize: 2,
        }}
      />
    </Box>
  );
};

export default MonacoEditor;

const getLanguage = (path: string | undefined) => {
  if (path) {
    switch (Path.extname(path)) {
      case ".ts":
        return "typescript";
      case ".js":
        return "javascript";
      case ".css":
        return "css";
      case ".html":
        return "html";
      default:
        return "txt";
    }
  }
  return undefined;
};

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
