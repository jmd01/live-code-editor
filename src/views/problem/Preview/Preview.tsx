import { Box } from "@mui/material";
import * as esbuild from "esbuild-wasm";
import { customResolver } from "./plugins/customResolver";
import { fetchPlugin, tsxFetchPlugin } from "./plugins/fetch-plugin";
import { FileNode } from "../../../pages/problems/problem";
import { useEffect, useRef } from "react";

type PreviewProps = {
  tree: FileNode[];
};
const Preview = ({ tree }: PreviewProps) => {
  const initialisedEsbuild = useRef<Promise<void> | null>(null);
  useEffect(() => {
    if (!initialisedEsbuild.current) {
      initialisedEsbuild.current = esbuild.initialize({
        wasmURL: "/esbuild-0-14-43.wasm",
      });
    }
  }, []);

  const bundle = async () => {
    await initialisedEsbuild;
    const result = await esbuild.build({
      entryPoints: ["index.tsx"],
      plugins: [customResolver(), tsxFetchPlugin(tree)],
      bundle: true,
      write: false,
    });

    const js = result.outputFiles[0].text;
    console.log(js);

    const iframe = document.getElementById("iframe") as HTMLIFrameElement;
    console.log("iframe", iframe);
    iframe.contentWindow?.postMessage(
      { type: "onload", js, css: "", html: '<div id="root"></div>' },
      "http://localhost:4001"
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "50%",
      }}
    >
      <h2>Preview</h2>
      <button onClick={bundle}>Bundle it up</button>
      <iframe id="iframe" src="http://localhost:4001/" />
    </Box>
  );
};

export default Preview;
