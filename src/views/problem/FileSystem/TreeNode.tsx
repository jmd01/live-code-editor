import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Close, FileDocument, Folder, Pencil } from "mdi-material-ui";
import { styled } from "@mui/material/styles";
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { useHover } from "react-use";

type TreeNodeProps = {
  fullPath: string;
  pathToSegment: string;
  pathSegment: string;
  id: string;
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
};

export const TreeNode = ({
  fullPath,
  pathToSegment,
  pathSegment,
  id,
  updateFileName,
  deleteFile,
}: TreeNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(pathSegment);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    console.log(fullPath, pathToSegment, pathSegment, e.target.value);
    updateFileName(
      pathToSegment,
      pathToSegment.replace(pathSegment, e.target.value)
    );
  };

  const onDelete = () => {
    confirm("Are you sure you want to delete this file") &&
      deleteFile(pathToSegment);
  };

  const element = (hovered: boolean) => (
    <Stack justifyContent="space-between" direction={"row"} width={"100%"}>
      {isEditing ? (
        <NameInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span>{pathSegment}</span>
      )}
      {hovered && (
        <NodeEditor setIsEditing={setIsEditing} onDelete={onDelete} />
      )}
    </Stack>
  );
  const [hoverable] = useHover(element);

  return hoverable;
};

const MinimalIconButton = styled(IconButton)`
  padding: 0;
  color: ${({ theme }) => theme.palette.grey[500]};

  :hover {
    color: ${({ theme }) => theme.palette.grey[900]};
    background: none;
  }
`;

const NodeEditor = ({
  setIsEditing,
  onDelete,
}: {
  setIsEditing: (value: boolean) => void;
  onDelete: () => void;
}) => {
  return (
    <Stack direction={"row"} padding={"0 8px"} gap={1} height={24}>
      <MinimalIconButton
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <Pencil sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <FileDocument sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton>
        <Folder sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton onClick={onDelete}>
        <Close sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
    </Stack>
  );
};

const NameInput = styled("input")`
  border: none;
  outline: none;
  height: 22px;
`;
