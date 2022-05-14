import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Close, FileDocument, Folder, Pencil } from "mdi-material-ui";
import { styled } from "@mui/material/styles";
import React, { ChangeEvent, FocusEvent, useState } from "react";
import { useHover } from "react-use";

export const TreeNode = ({
  title,
  id,
  updateNode,
}: {
  title: string;
  id: string;
  updateNode: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);

    // TODO
    updateNode();
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
        <span>{title}</span>
      )}
      {hovered && <NodeEditor setIsEditing={setIsEditing} />}
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
}: {
  setIsEditing: (value: boolean) => void;
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
      <MinimalIconButton>
        <FileDocument sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton>
        <Folder sx={{ fontSize: "1rem" }} />
      </MinimalIconButton>
      <MinimalIconButton>
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
