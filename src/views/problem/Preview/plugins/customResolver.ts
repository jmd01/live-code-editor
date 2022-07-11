import * as Path from "path-browserify";
import { OnResolveArgs, Plugin } from "esbuild-wasm";
import { Dependency } from "src/pages/problems/problem/types";
import semver from "semver";

type PkgJsonResolvedDeps = Record<string, Record<string, string>>;

export function customResolver(dependencies: Dependency[] | undefined): Plugin {
  const depNames = dependencies
    ? dependencies.map(({ name }) => name).join("|")
    : "";
  const topLevelDeps = new RegExp(`^${depNames}$`);

  const pkgJsonResolvedDeps: PkgJsonResolvedDeps = {};

  return {
    name: "customResolver",
    setup: (build) => {
      // handle relative paths within a dep
      build.onResolve(
        { filter: /^\.+\//, namespace: "unpkg" },
        (args: OnResolveArgs) => {
          const ret = {
            namespace: "unpkg",
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
          };

          // console.log("onResolve: paths within a dep", args.path, ret);
          return ret;
        }
      );

      // handle main file of a sub dep
      build.onResolve(
        { filter: /.*/, namespace: "unpkg" },
        async (args: OnResolveArgs) => {
          // Get everything after domain
          const unpkgPath = args.importer.replace("https://unpkg.com/", "");
          const { packageName: dependencyOfPackageName } =
            getPackageNameAndPath(unpkgPath);

          console.log(
            "main file of a sub dep",
            "args",
            args,
            "dependencyOfPackageName",
            dependencyOfPackageName,
            "pkgJsonDeps",
            pkgJsonResolvedDeps
          );

          // args.path could be package or package/path or @scopedPackage/foo or @scopedpackage/foo/path
          const getSubDepPathWithVersion = (): string | undefined => {
            const { packageName, packageFilePath } = getPackageNameAndPath(
              args.path
            );

            if (
              dependencyOfPackageName in pkgJsonResolvedDeps &&
              packageName in pkgJsonResolvedDeps[dependencyOfPackageName]
            ) {
              const version =
                pkgJsonResolvedDeps[dependencyOfPackageName][packageName];
              return `${packageName}@${version}${packageFilePath}`;
            }
          };

          const path = getSubDepPathWithVersion();

          if (path) {
            const ret = {
              namespace: "unpkg",
              path: `https://unpkg.com/${path}`,
            };

            // console.log("onResolve: main file of a sub dep", args, ret);
            return ret;
          } else {
            const importerPath = args.importer.replace(
              "https://unpkg.com/",
              ""
            );
            const resolvedDeps = await getResolvedDeps(importerPath);
            pkgJsonResolvedDeps[importerPath] = resolvedDeps;

            // TODO what if there is a filepath?
            if (args.path in resolvedDeps) {
              const version = resolvedDeps[args.path];
              // return `${packageName}@${version}${packageFilePath}`;

              const path = version ? `${args.path}@${version}` : args.path;

              const ret = {
                namespace: "unpkg",
                path: `https://unpkg.com/${path}`,
              };
              return ret;
            }

            console.log(
              "importerPath",
              importerPath,
              "resolvedDeps",
              resolvedDeps,
              "pkgJsonResolvedDeps",
              pkgJsonResolvedDeps
            );
          }

          throw new ResolveError(
            "Sub dependency missing",
            args,
            pkgJsonResolvedDeps
          );
        }
      );

      // handle main file of a dep
      build.onResolve({ filter: topLevelDeps }, async (args: OnResolveArgs) => {
        // console.log("handle main file of a dep", args, dependencies);
        const version =
          dependencies &&
          dependencies?.find((dep) => dep.name === args.path)?.version;
        const path = version ? `${args.path}@${version}` : args.path;

        pkgJsonResolvedDeps[path] = await getResolvedDeps(path);

        const ret = {
          namespace: "unpkg",
          path: `https://unpkg.com/${path}`,
        };

        console.log("onResolve: main file of a dep", args, ret);
        return ret;
      });

      // anything else - should only be virtual tree files
      build.onResolve({ filter: /.*/ }, (args: OnResolveArgs) => {
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

        console.log("args", args)
        throw Error("not resolvable");
      });
    },
  };
}

export class ResolveError extends Error {
  args: OnResolveArgs;
  pkgJsonResolvedDeps: PkgJsonResolvedDeps;

  constructor(
    message: string,
    args: OnResolveArgs,
    pkgJsonResolvedDeps: PkgJsonResolvedDeps
  ) {
    super(message);
    this.name = "ResolveError";
    this.args = args;
    this.pkgJsonResolvedDeps = pkgJsonResolvedDeps;
  }
}

export const isResolveError = (e: Error) => e.name === "ResolveError";

const getPackageNameAndPath = (
  path: string
): { packageName: string; packageFilePath: string } => {
  let matches: RegExpMatchArray | null;
  if (path.startsWith("@")) {
    // Matches eg (@aaa/bbb)(/ccc) or (@aaa/bbb)
    //  - group 1 everything upto but not including the 2nd slash
    //  - group 2 the rest (if present)
    // According to: https://npm.runkit.com/validate-npm-package-name
    // If it's a scoped package, package name must have one and only one slash
    // So everything else would be a file within the package
    matches = path.match(/^([^/]*\/[^/]*)(.*)/);
  } else {
    // Matches eg (aaa) or (aaa)(/bbb)
    //  - group 1 everything upto but not including the 1st slash
    //  - group 2 the rest (if present)
    // According to: https://npm.runkit.com/validate-npm-package-name
    // If it's not a scoped package, package name cannot have a slash
    // So everything from 1st slash onwords (if present) would be a file within the package
    matches = path.match(/^([^/]*)(.*)/);
  }

  const packageName = matches && matches.length > 1 ? matches[1] : "";
  const packageFilePath = matches && matches.length === 3 ? matches[2] : "";

  // console.log("packageName", packageName, "packageFilePath", packageFilePath);

  return {
    packageName,
    packageFilePath,
  };
};

const getResolvedDeps = async (
  path: string
): Promise<Record<string, string>> => {
  const pkgJsonResponse = await fetch(`https://unpkg.com/${path}/package.json`);
  const pkgJson = await pkgJsonResponse.json();
  // console.log("pkgJson.json", pkgJson, args);

  const pkgJsonDeps = Object.entries({
    ...(pkgJson.dependencies ?? {}),
    ...(pkgJson.peerDependencies ?? {}),
  });

  const resolvedDeps = await Promise.all(
    pkgJsonDeps
      .map(async ([dep, ver]) => {
        const npmResponse: Response = await fetch(
          `https://registry.npmjs.org/${dep}`
        );
        const npmJson = await npmResponse.json();
        const versions = npmJson.versions ? Object.keys(npmJson.versions) : [];

        const maxVersion = semver.maxSatisfying(versions, ver as string);
        // console.log("maxVersion", maxVersion, ver);

        if (!maxVersion) {
          console.error(`${ver} is not a valid semver for ${dep}`);
        }
        return [dep, maxVersion ?? "*"];
      })
      .filter(notEmpty)
  );

  // console.log("resolvedDeps", resolvedDeps);
  return Object.fromEntries(resolvedDeps);
};

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
