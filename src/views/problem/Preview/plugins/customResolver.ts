import * as Path from "path-browserify";
import { Plugin } from "esbuild-wasm";
import { Dependency } from "src/pages/problems/problem/types";
import semver from "semver";

export function customResolver(dependencies: Dependency[] | undefined): Plugin {
  const depNames = dependencies
    ? dependencies.map(({ name }) => name).join("|")
    : "";
  const topLevelDeps = new RegExp(`^${depNames}$`);

  const pkgJsonResolvedDeps = {
    // "react-dom@17.0.2": {
    //   "loose-envify": "^1.1.0",
    //   "object-assign": "^4.1.1",
    // },
  };

  return {
    name: "customResolver",
    setup: (build) => {
      // handle relative paths within a dep
      build.onResolve({ filter: /^\.+\//, namespace: "unpkg" }, (args: any) => {
        const ret = {
          namespace: "unpkg",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };

        console.log("onResolve: paths within a dep", args.path, ret);
        return ret;
      });

      // handle main file of a sub dep
      build.onResolve(
        { filter: /.*/, namespace: "unpkg" },
        async (args: any) => {
          const dependencyOf = args.importer.match(
            /https:\/\/unpkg.com\/([^/]*)/
          );

          // const path = pkgJsonDeps[dependencyOf][args.path];
          console.log(
            "dependencyOf",
            dependencyOf,
            "pkgJsonDeps",
            pkgJsonResolvedDeps,
            "args.path",
            args.path,
            "semver",
            semver.valid("1.2.3")
            // "path",
            // path
          );

          const ret = {
            namespace: "unpkg",
            path: `https://unpkg.com/${args.path}`,
          };

          console.log("onResolve: main file of a sub dep", args, ret);
          return ret;
        }
      );

      // handle main file of a dep
      build.onResolve({ filter: topLevelDeps }, async (args: any) => {
        // console.log("handle main file of a dep", args, dependencies);
        const version =
          dependencies &&
          dependencies?.find((dep) => dep.name === args.path)?.version;
        const path = version ? `${args.path}@${version}` : args.path;

        const pkgJsonResponse = await fetch(
          `https://unpkg.com/${path}/package.json`
        );
        const pkgJson = await pkgJsonResponse.json();
        // console.log("pkgJson.json", pkgJson, args);

        const pkgJsonDeps = Object.entries({
          ...(pkgJson.dependencies ?? {}),
          ...(pkgJson.peerDependencies ?? {}),
        });

        const resolvedDeps = await Promise.all(pkgJsonDeps.map(async ([dep, ver]) => {
          const npmResponse: Response = await fetch(
            `https://registry.npmjs.org/${dep}`
          );
          const npmJson = await npmResponse.json();
          const versions = npmJson.versions
            ? Object.keys(npmJson.versions)
            : [];

          const maxVersion = semver.maxSatisfying(versions, ver as string);
          console.log("maxVersion", maxVersion, ver);

          if (!maxVersion) {
            console.error(`${ver} is not a valid semver for ${dep}`);
          }
          return [dep, maxVersion ?? null];
        }));

        console.log("resolvedDeps", resolvedDeps);
        pkgJsonResolvedDeps[path] = Object.fromEntries(resolvedDeps);

        const ret = {
          namespace: "unpkg",
          path: `https://unpkg.com/${path}`,
        };

        console.log("onResolve: main file of a dep", args, ret);
        return ret;
      });

      // anything else - should only be virtual tree files
      build.onResolve({ filter: /.*/ }, (args) => {
        // console.log("onResolve: should only be virtual tree files", args);
        if (args.kind === "entry-point") {
          return { namespace: "virtual", path: "/" + args.path };
        }

        if (args.kind === "import-statement") {
          if (args.resolveDir || args.path.startsWith(".")) {
            const dirname = Path.dirname(args.importer);

            const path = Path.join(dirname, args.path);

            return { namespace: "virtual", path };
          }
        }

        throw Error("not resolvable");
      });
    },
  };
}
