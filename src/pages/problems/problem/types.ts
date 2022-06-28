export type FileNode = {
  id: string;
  path: string;
  contents: string;
  isEmptyDir?: boolean;
};

export type Dependency = { name: string; version: string };