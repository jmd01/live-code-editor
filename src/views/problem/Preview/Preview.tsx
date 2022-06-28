import { Box, Icon, Stack, Typography } from "@mui/material";
import * as esbuild from "esbuild-wasm";
import {
  customResolver,
  isResolveError,
  ResolveError,
} from "./plugins/customResolver";
import { fetchPlugin, tsxFetchPlugin } from "./plugins/fetch-plugin";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { styled } from "@mui/material/styles";
import { Dependency, FileNode } from "src/pages/problems/problem/types";
import { match } from "ts-pattern";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

type PreviewProps = {
  tree: FileNode[];
  editorValue: string | undefined;
  activeFile: FileNode | undefined;
  dependencies: Dependency[] | undefined;
};

const Preview = ({
  tree,
  activeFile,
  editorValue,
  dependencies,
}: PreviewProps) => {
  // console.log("dependencies", dependencies);
  const [bundlerError, setBundlerError] = useState(false);

  const initialisedEsbuild = useRef<Promise<void> | null>(null);
  useEffect(() => {
    // console.log(initialisedEsbuild, esbuild);
    if (!initialisedEsbuild.current) {
      try {
        initialisedEsbuild.current = esbuild.initialize({
          wasmURL: "/esbuild-0-14-43.wasm",
        });
      } catch {
        // no-op
      }
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
    // console.log("treeWithLatestEditorValue", treeWithLatestEditorValue);

    try {
      await initialisedEsbuild.current;
      const result = await esbuild.build({
        entryPoints: ["index.tsx"],
        plugins: [
          customResolver(dependencies),
          tsxFetchPlugin(treeWithLatestEditorValue),
        ],
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

      setBundlerError(false);
    } catch (e) {
      if (e instanceof ResolveError) {
        // console.error("[Bundling error: ResolveError]", e);
      } else {
        // console.error("[Bundling error]", e);
      }
      setBundlerError(true);
    }
  }, [tree, editorValue, dependencies]);

  const debouncedBundle = useDebouncedCallback(bundle, 250);

  useEffect(() => {
    debouncedBundle();
  }, [debouncedBundle, tree, editorValue, dependencies]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "50%",
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        padding={2}
        direction="column"
        height="100%"
        display={bundlerError ? "flex" : "none"}
      >
        <Stack alignItems="center" direction="row" spacing={1}>
          <ErrorOutlineIcon color="error" />
          <Typography variant="h6" color="error">
            Build error
          </Typography>
        </Stack>
        <Typography variant="subtitle2">Check your console log</Typography>
      </Stack>
      <Iframe
        style={{ display: bundlerError ? "none" : "block" }}
        id="iframe"
        src="http://localhost:4001/"
      />
    </Box>
  );
};

export default Preview;

const Iframe = styled("iframe")`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.common.white};
`;
