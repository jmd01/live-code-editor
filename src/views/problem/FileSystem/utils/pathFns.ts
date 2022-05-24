import * as Path from "path-browserify";

/**
 * Checks path has a file extension
 * @param path
 */
export const isLeaf = (path: string): boolean => {
  return !!Path.extname(path);
};

/**
 * If leaf node checks filename has an extension, if directory checks it doesn't
 */
export const isValidName = (filename: string, isDir: boolean) =>
  filename && (isDir ? !Path.extname(filename) : !!Path.extname(filename));

/**
 * If leaf node, get parent dir, if dir then return itself
 */
export const getDirectory = (path: string) => {
  return isLeaf(path) ? Path.dirname(path) : path;
};
