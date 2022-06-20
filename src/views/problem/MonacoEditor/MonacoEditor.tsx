import Editor, {
  EditorProps,
  Monaco,
  OnMount,
  useMonaco,
} from "@monaco-editor/react";
import * as Path from "path-browserify";
import React, { useEffect, useMemo, useState } from "react";
import { editor } from "monaco-editor";
import { FileNode } from "src/pages/problems/problem";
import { useTheme } from "@mui/material/styles";
import { useSettings } from "../../../@core/hooks/useSettings";
import { AutoTypings, LocalStorageCache } from "monaco-editor-auto-typings";

// export type DirtyFiles =
//   | Record<FileNode["id"], FileNode["contents"]>
//   | undefined;

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
  setEditorValue
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

  // useEffect(() => {
  //   monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  //   monaco?.languages.typescript.typescriptDefaults.setCompilerOptions({
  //     allowSyntheticDefaultImports: true,
  //     jsx: monaco?.languages.typescript.JsxEmit.React,
  //     moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  //     allowNonTsExtensions: true,
  //     target: monaco.languages.typescript.ScriptTarget.ES2020,
  //     // include: ["**/*"],
  //   });
  // }, [monaco]);

  useEffect(() => {
    if (monaco) {
      console.log("useEffect setModel", tree, monaco.editor.getModels());
      tree.map(({ contents, path }) => {
        const uri = monaco.Uri.file(path);
        const model = monaco.editor.getModel(uri);
        console.log("getModel", path, model);
        model
          ? model.setValue(contents)
          : monaco.editor.createModel(contents, undefined, uri);
        // monaco.languages.typescript.javascriptDefaults.addExtraLib(
        //   contents,
        //   uri.toString()
        // );
      });

      console.log(monaco.editor.getModels());
    }
  }, [monaco, tree]);

  useEffect(() => {
    if (monaco) {
      console.log("setTheme", settings.mode);
      monaco.editor.setTheme(
        settings.mode === "light" ? "vs-modified" : "vs-dark-modified"
      );
      console.log("monaco", monaco, "settings.mode", settings.mode);
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
    console.log("handleEditorMount");
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      // module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
    });

    // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    //   noSemanticValidation: false,
    //   noSyntaxValidation: true,
    // })

    // const autoTypings = AutoTypings.create(monacoEditor, {
    //   sourceCache: new LocalStorageCache(), // Cache loaded sources in localStorage. May be omitted
    //   monaco: monaco,
    // });
  };

  useEffect(() => {
    setEditorValue(activeFile?.contents ?? "");
  }, [activeFile]);

  console.log("activeFile", activeFile);
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      onChange={(value) => {
        console.log("onChange value", value, activeFile);
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
      // theme={editorTheme}
      theme={"vs-dark"}
      onMount={handleEditorMount}
    />
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
