import * as Path from "path-browserify";
import {Plugin} from "esbuild-wasm";

const deps = ["react"];
const topLevelDeps = new RegExp(deps.join("|"));

export function customResolver(): Plugin {
  return {
    name: "customResolver",
    setup: (build) => {
      // handle relative paths within a dep
      build.onResolve({filter: /^\.+\//, namespace: "unpkg"}, (args: any) => {
        const ret = {
          namespace: "unpkg",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };

        // console.log("onResolve: paths within a dep", args.path, ret);
        return ret
      });

      // handle main file of a sub dep
      build.onResolve({filter: /.*/, namespace: "unpkg"}, async (args: any) => {
        const ret = {
          namespace: "unpkg",
          path: `https://unpkg.com/${args.path}`,
        };

        // console.log("onResolve: main file of a dep", args, ret);
        return ret
      });

      // handle main file of a dep
      build.onResolve({filter: topLevelDeps}, async (args: any) => {
        const ret = {
          namespace: "unpkg",
          path: `https://unpkg.com/${args.path}`,
        };

        // console.log("onResolve: main file of a dep", args, ret);
        return ret
      });

      // anything else - should only be virtual tree files
      build.onResolve({filter: /.*/}, (args) => {
        // console.log("onResolve: should only be virtual tree files", args);
        if (args.kind === "entry-point") {
          return {namespace: "virtual", path: "/" + args.path};
        }

        if (args.kind === "import-statement") {
          if (args.resolveDir || args.path.startsWith('.')) {
            const dirname = Path.dirname(args.importer);

            const path = Path.join(dirname, args.path);

            return {namespace: "virtual", path};
          }
        }

        throw Error("not resolvable");
      });
    },
  };
}
