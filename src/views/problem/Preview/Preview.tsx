import { Box } from "@mui/material";
import * as esbuild from "esbuild-wasm";
import { customResolver } from "./plugins/customResolver";
import { fetchPlugin, tsxFetchPlugin } from "./plugins/fetch-plugin";
import { FileNode } from "../../../pages/problems/problem";
import { useCallback, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

type PreviewProps = {
  tree: FileNode[];
  editorValue: string | undefined;
  activeFile: FileNode | undefined;
};
const Preview = ({ tree, activeFile, editorValue }: PreviewProps) => {
  console.log("Preview", activeFile, editorValue);
  const initialisedEsbuild = useRef<Promise<void> | null>(null);
  useEffect(() => {
    if (!initialisedEsbuild.current) {
      initialisedEsbuild.current = esbuild.initialize({
        wasmURL: "/esbuild-0-14-43.wasm",
      });
    }
  }, []);

  const bundle = useCallback(async () => {
    const treeWithLatestEditorValue = tree.map((fileNode) => {
      return fileNode.id === activeFile?.id && editorValue
        ? { ...activeFile, contents: editorValue }
        : fileNode;
    });

    // console.log("tree", tree);
    // console.log("activeFile", activeFile);
    console.log("treeWithLatestEditorValue", treeWithLatestEditorValue);

    await initialisedEsbuild.current;
    const result = await esbuild.build({
      entryPoints: ["index.tsx"],
      plugins: [customResolver(), tsxFetchPlugin(treeWithLatestEditorValue)],
      bundle: true,
      write: false,
    });

    const js = result.outputFiles[0].text;
    // console.log(js);

    const iframe = document.getElementById("iframe") as HTMLIFrameElement;
    // console.log("iframe", iframe);
    iframe.contentWindow?.postMessage(
      { type: "onload", js, css: "", html: '<div id="root"></div>' },
      "http://localhost:4001"
    );
  }, [tree, editorValue]);

  const debouncedBundle = useDebouncedCallback(bundle, 250);

  useEffect(() => {
    debouncedBundle();
  }, [debouncedBundle, tree, editorValue]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "50%",
      }}
    >
      <iframe id="iframe" src="http://localhost:4001/" />
    </Box>
  );
};

export default Preview;
