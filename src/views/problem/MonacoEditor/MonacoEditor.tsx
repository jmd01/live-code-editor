import Editor, {
  EditorProps,
  Monaco,
  OnMount,
  useMonaco,
} from "@monaco-editor/react";
import * as Path from "path-browserify";
import React, { useEffect, useMemo, useState } from "react";
import { editor, languages } from "monaco-editor";
import { useTheme } from "@mui/material/styles";
import { useSettings } from "../../../@core/hooks/useSettings";
import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings";
import { FileNode } from "src/pages/problems/problem/types";
import { withNoSSR } from "src/pages/problems/problem/withNoSSR";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MonacoJSXHighlighter from "monaco-jsx-highlighter";

type MonacoEditorProps = {
  tree: FileNode[];
  monaco: Monaco;
  setActiveFile: (file: FileNode | undefined) => void;
  activeFile: FileNode | undefined;
  setEditorValue: (editorValue: string | undefined) => void;
  editorValue: string | undefined;
  // setDirtyFiles: React.Dispatch<React.SetStateAction<DirtyFiles>>;
  // dirtyFiles: DirtyFiles;
};
const MonacoEditor = ({
  tree = [],
  monaco,
  activeFile,
  setActiveFile,
  editorValue,
  setEditorValue,
}: MonacoEditorProps) => {
  const theme = useTheme();
  const { settings } = useSettings();

  const [language, setLanguage] = useState(getLanguage(activeFile?.path));
  const [path, setPath] = useState(activeFile?.path);
  const [minimap, setMinimap] = useState(true);
  const [editorTheme, setEditorTheme] = useState(
    settings.mode === "light" ? "vs-modified" : "vs-dark-modified"
  );
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] =
    useState<editor.IEditorOptions["wordWrap"]>("off");

  useEffect(() => {
    setLanguage(getLanguage(activeFile?.path));
    setPath(activeFile?.path);
  }, [activeFile]);

  useEffect(() => {
    monaco?.editor.defineTheme("vs-modified", vsTheme);
    monaco?.editor.defineTheme("vs-dark-modified", vsDarkTheme);
  }, [monaco]);

  useEffect(() => {
    console.log(monaco?.languages, monaco?.languages.typescript.JsxEmit.React);
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
      // console.log("useEffect setModel", tree, monaco.editor.getModels());
      tree.map(({ contents, path }) => {
        const uri = monaco.Uri.file(path);
        const model = monaco.editor.getModel(uri);
        // console.log("getModel", path, model);
        model
          ? model.setValue(contents)
          : monaco.editor.createModel(contents, undefined, uri);
        // monaco.languages.typescript.javascriptDefaults.addExtraLib(
        //   contents,
        //   uri.toString()
        // );
      });

      // console.log(monaco.editor.getModels());
    }
  }, [monaco, tree]);

  useEffect(() => {
    if (monaco) {
      // console.log("setTheme", settings.mode);
      monaco.editor.setTheme(
        settings.mode === "light" ? "vs-modified" : "vs-dark-modified"
      );
      // console.log("monaco", monaco, "settings.mode", settings.mode);
    }
  }, [monaco, settings.mode]);

  // useEffect(() => {
  //   // Initialize auto typing on monaco editor. Imports will now automatically be typed!
  //   const autoTypings = AutoTypings.create(monaco, {
  //     sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
  //     // Other options...
  //   });
  // }, []);

  const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    // console.log("handleEditorMount");
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      // module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
      jsx: languages.typescript.JsxEmit.React
    });

    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco, // references Range and other APIs
      parse, // obtains an AST, internally passes to parse options: {...options, sourceType: "module",plugins: ["jsx"],errorRecovery: true}
      traverse, // helps collecting the JSX expressions within the AST
      monacoEditor // highlights the content of that editor via decorations
    );
    // Start the JSX highlighting and get the dispose function
    let disposeJSXHighlighting = monacoJSXHighlighter.highlightOnDidChangeModelContent();
    // Enhance monaco's editor.action.commentLine with JSX commenting and get its disposer
    let disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();
  
    // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    //   noSemanticValidation: false,
    //   noSyntaxValidation: true,
    // })

    // const autoTypings = AutoTypings.create(monacoEditor, {
    //   sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
    //   monaco: monaco,
    // });

    // @ts-ignore
    // window.MonacoEnvironment.getWorkerUrl = (
    //   _moduleId: string,
    //   label: string
    // ) => {
    //   if (label === "json")
    //     return "_next/static/json.worker.js";
    //   if (label === "css")
    //     return "_next/static/css.worker.js";
    //   if (label === "html")
    //     return "_next/static/html.worker.js";
    //   if (
    //     label === "typescript" ||
    //     label === "javascript"
    //   )
    //     return "_next/static/ts.worker.js";
    //   return "_next/static/editor.worker.js";
    // };
  };

  useEffect(() => {
    setEditorValue(activeFile?.contents ?? "");
  }, [activeFile]);

  // console.log("activeFile", activeFile);
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      onChange={(value) => {
        // console.log("onChange value", value, activeFile);
        setEditorValue(value);
        // activeFile &&
        //   setActiveFile({
        //     ...activeFile,
        //     contents: value ?? "",
        //   });
      }}
      value={editorValue}
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
      theme={editorTheme}
      onMount={handleEditorMount}
    />
  );
};

export default withNoSSR(MonacoEditor);

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
