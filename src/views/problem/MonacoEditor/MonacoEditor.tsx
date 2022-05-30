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
  tree: FileNode[];
};
const MonacoEditor = ({ file, tree }: MonacoEditorProps) => {
  const theme = useTheme();
  const monaco = useMonaco();
  const { settings } = useSettings();

  const [value, setValue] = useState(file?.contents);
  const [language, setLanguage] = useState(getLanguage(file?.path));
  const [path, setPath] = useState(file?.path);
  const [minimap, setMinimap] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] =
    useState<editor.IEditorOptions["wordWrap"]>("off");

  useEffect(() => {
    setValue(file?.contents);
    setLanguage(getLanguage(file?.path));
    setPath(file?.path);
  }, [file]);

  useEffect(() => {
    monaco?.editor.defineTheme("vs-modified", vsTheme);
    monaco?.editor.defineTheme("vs-dark-modified", vsDarkTheme);
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco?.languages.typescript.typescriptDefaults.setCompilerOptions({
      allowSyntheticDefaultImports: true,
      jsx: monaco?.languages.typescript.JsxEmit.React,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      // include: ["**/*"],
    });
  }, [monaco]);

  useEffect(() => {
    if (monaco) {
      tree.map(({ contents, path }) => {
        const uri = monaco.Uri.file(path);
        // monaco.languages.typescript.javascriptDefaults.addExtraLib(
        //   contents,
        //   uri.toString()
        // );
        monaco.editor.createModel(contents, undefined, uri);
      });
    }
  }, [monaco, tree]);

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
        path={path}
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
          contextmenu: false,
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
