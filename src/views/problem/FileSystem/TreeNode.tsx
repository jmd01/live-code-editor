import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Close, FileDocument, Folder, Pencil } from "mdi-material-ui";
import { styled } from "@mui/material/styles";
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { useHover } from "react-use";
import { isLeaf, isValidName } from "./utils/pathFns";
import { FileNode } from "../../../pages/problems/FileNode";
import { Key } from "rc-tree/lib/interface";

export type TreeNodeProps = {
  fileNode: FileNode;
  pathToSegment: string;
  pathSegment: string;
  updateFileName: (oldFilePath: string, newFilePath: string) => void;
  deleteFile: (filePath: string) => void;
  addFile: (
    pathToSegment: string,
    newFileName: string,
    isDir?: boolean
  ) => void;
  setActiveFile: (value: FileNode) => void;
  setExpandedKeys: (value: (keys: Key[]) => Key[]) => void;
};

export const TreeNode = ({
  fileNode,
  pathToSegment,
  pathSegment,
  updateFileName,
  deleteFile,
  addFile,
  setActiveFile,
  setExpandedKeys,
}: TreeNodeProps) => {
  const [isAddingDir, setIsAddingDir] = useState<boolean>();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditedNameValid, setIsEditedNameValid] = useState(true);
  const [isAddNameValid, setIsAddNameValid] = useState(false);
  const [editFilenameValue, setEditFilenameValue] = useState(pathSegment);
  const [addFilenameValue, setAddFilenameValue] = useState("");

  const onEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditFilenameValue(e.target.value);
    if (!isValidName(e.target.value, !isLeaf(pathToSegment))) {
      setIsEditedNameValid(false);
    } else {
      setIsEditedNameValid(true);
    }
  };
  const onAddInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddFilenameValue(e.target.value);
    if (!isValidName(e.target.value, !!isAddingDir)) {
      setIsAddNameValid(false);
    } else {
      setIsAddNameValid(true);
    }
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!isEditedNameValid) {
      return;
    }

    setIsEditing(false);
    updateFileName(
      pathToSegment,
      pathToSegment.replace(pathSegment, e.target.value)
    );
  };

  const onDelete = () => {
    confirm("Are you sure you want to delete this file") &&
      deleteFile(pathToSegment);
  };

  const onAdd = (isDir?: boolean) => {
    setIsAddingDir(isDir);
    setDialogOpen(true);
  };

  const onAddFile = () => {
    if (!isAddNameValid) {
      return;
    }
    addFile(pathToSegment, addFilenameValue, isAddingDir);
    setDialogOpen(false);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const element = (hovered: boolean) => (
    <Stack
      justifyContent="space-between"
      alignItems="stretch"
      direction={"row"}
      width={"100%"}
    >
      {isEditing ? (
        <NameInput
          value={editFilenameValue}
          onChange={onEditInputChange}
          onBlur={onBlur}
          onClick={(e) => e.stopPropagation()}
          error={!isEditedNameValid}
        />
      ) : (
        <span
          style={{ width: "100%" }}
          onClick={() => {
            return isLeaf(pathToSegment)
              ? setActiveFile(fileNode)
              : setExpandedKeys((keys) =>
                  keys.includes(pathToSegment)
                    ? keys.filter((path) => path !== pathToSegment)
                    : [...keys, pathToSegment]
                );
          }}
        >
          {pathSegment}
        </span>
      )}
      {hovered && (
        <NodeEditor
          setIsEditing={setIsEditing}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      )}
    </Stack>
  );
  const [hoverable] = useHover(element);

  return (
    <>
      {hoverable}
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        <DialogTitle>Add new</DialogTitle>
        <DialogContent>
          <Stack direction="row" sx={{ gap: "12px" }} paddingTop={2}>
            <TextField
              id="outlined-basic"
              label="New filename"
              variant="outlined"
              size="small"
              value={addFilenameValue}
              onChange={onAddInputChange}
              error={!isAddNameValid}
              helperText="Filenames must have an extension eg .ts"
            />
            <Button variant="contained" onClick={() => onAddFile()}>
              Add
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
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
  onAdd,
}: {
  setIsEditing: (value: boolean) => void;
  onDelete: () => void;
  onAdd: (isDir?: boolean) => void;
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
          onAdd();
        }}
      >
        <FileDocument sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton
        onClick={(e) => {
          e.stopPropagation();
          onAdd(true);
        }}
      >
        <Folder sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton onClick={onDelete}>
        <Close sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
    </Stack>
  );
};

const NameInput = styled("input")<{ error: boolean }>`
  border: none;
  outline: none;
  height: 22px;
  ${({ error, theme }) => error && `color: ${theme.palette.error.main}`};
`;
