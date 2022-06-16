import * as esbuild from "esbuild-wasm";
import localForage from "localforage";
import axios from "axios";
import { Loader, OnLoadResult } from "esbuild-wasm";
import * as Path from "path-browserify";
import { FileNode } from "../../../../pages/problems/problem";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (tree: Record<string, string>) => {
  const map = new Map(Object.entries(tree));

  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        console.log("onLoad .* 1", args, cachedResult);

        if (cachedResult) {
          return cachedResult;
        }
      });

      // load css files
      build.onLoad(
        { filter: /.css$/, namespace: "unpkg" },
        async (args: any) => {
          const { data, request } = await axios.get(args.path);

          const escaped = data
            .replace(/\n/g, "")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");

          const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

          const result: esbuild.OnLoadResult = {
            loader: "jsx",
            contents,
            resolveDir: new URL("./", request.responseURL).pathname,
          };

          await fileCache.setItem(args.path, result);
          console.log("onLoad css", args, result);

          return result;
        }
      );

      // load javascript / jsx files
      build.onLoad({ filter: /.*/, namespace: "unpkg" }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        console.log("onLoad .* 2", args, result);

        return result;
      });
    },
  };
};

export const tsxFetchPlugin = (tree: FileNode[]) => {
  const map = new Map(tree.map((file) => [`/${file.path}`, file.contents]));
  console.log("map", map);
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => {
        console.log("onLoad", args.path);
        if (!map.has(args.path)) {
          throw Error(`${args.path} not loadable`);
        }
        const contents = map.get(args.path);

        let loader: Loader = "default";
        switch (Path.extname(args.path)) {
          case ".ts":
            loader = "ts";
            break;
          case ".js":
            loader = "js";
            break;
          case ".tsx":
            loader = "tsx";
            break;
          case ".jsx":
            loader = "jsx";
            break;
        }
        return { contents, loader };
      });

      // load index.ts file
      // build.onLoad({ filter: /(^index\.ts$)/ }, () => {
      //   return {
      //     loader: 'tsx',
      //     contents: inputCode,
      //   };
      // });

      // check the file cache
      build.onLoad({ filter: /.*/, namespace: "unpkg" }, async (args: any) => {
        const cachedResult = await fileCache.getItem(args.path);

        if (cachedResult) {
          return cachedResult as Promise<OnLoadResult>;
        }
      });

      // load css files
      build.onLoad(
        { filter: /.css$/, namespace: "unpkg" },
        async (args: any) => {
          const { data, request } = await axios.get(args.path);

          const escaped = data
            .replace(/\n/g, "")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");

          const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

          const result = {
            loader: "ts",
            contents,
            resolveDir: new URL("./", request.responseURL).pathname,
          };

          await fileCache.setItem(args.path, result);

          return result as OnLoadResult;
        }
      );

      // load javascript / jsx files
      build.onLoad({ filter: /.*/, namespace: "unpkg" }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result = {
          loader: "tsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result as OnLoadResult;
      });
    },
  };
};
