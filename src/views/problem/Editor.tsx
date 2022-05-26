import { FileNode } from "../../pages/problems/problem";

type EditorProps = {
  file: FileNode | undefined;
};
const Editor = ({ file }: EditorProps) => {
  console.log(file);
  return <h2>Editor</h2>;
};

export default Editor;
