import {
  Button,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import type {
  Dependency,
  DependencyWithId,
} from "src/pages/problems/problem/types";
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  useWatch,
  UseFieldArrayRemove,
} from "react-hook-form";
import Plus from "mdi-material-ui/Plus";
import Delete from "mdi-material-ui/Delete";
import { v4 } from "uuid";

type FormValues = {
  dependencies: DependencyWithId[];
};

type DependenciesProps = {
  dependencies: Dependency[] | undefined;
  setDependencies: Dispatch<SetStateAction<Dependency[] | undefined>>;
};
export const Dependencies = ({
  dependencies,
  setDependencies,
}: DependenciesProps) => {
  const defaultValues = {
    dependencies: [...(dependencies ?? [{ name: "", version: "", id: v4() }])],
  };

  const { control, watch } = useForm<FormValues>({
    defaultValues,
  });

  const watchedFields = watch("dependencies");

  const { prepend, remove, fields } = useFieldArray({
    control,
    name: "dependencies",
  });

  const [duplicateErrorFields, setDuplicateErrorFields] = useState<string[]>(
    []
  );

  const handleBlur = useCallback(
    (updatedField: DependencyWithId) => {
      const updatedFields = watchedFields.map((field) =>
        field.uid === updatedField.uid ? updatedField : field
      );

      const errorFieldIds = updatedFields.reduce<string[]>((acc, curField) => {
        const dupeNameFields = updatedFields.filter(
          (field) => field.name && field.name === curField.name
        );
        if (dupeNameFields.length > 1) {
          return [...acc, curField.uid];
        }
        return acc;
      }, []);

      setDuplicateErrorFields(errorFieldIds);

      const validDeps = updatedFields
        .filter(
          (field) =>
            field.name && field.version && !errorFieldIds.includes(field.uid)
        )
        .map(({ name, version }) => ({ name, version }));

        // console.log("updatedField", updatedField)

      setDependencies(validDeps);
    },
    [watchedFields]
  );
  // console.log("dependencies", dependencies, "watchedFields", watchedFields);

  const handleDelete = useCallback(
    (updatedField: DependencyWithId) => {
      const updatedFields = watchedFields.filter(
        (field) => field.uid !== updatedField.uid
      );

      const errorFieldIds = updatedFields.reduce<string[]>((acc, curField) => {
        const dupeNameFields = updatedFields.filter(
          (field) => field.name && field.name === curField.name
        );
        if (dupeNameFields.length > 1) {
          return [...acc, curField.uid];
        }
        return acc;
      }, []);

      setDuplicateErrorFields(errorFieldIds);

      const validDeps = updatedFields
        .filter(
          (field) =>
            field.name && field.version && !errorFieldIds.includes(field.uid)
        )
        .map(({ name, version }) => ({ name, version }));

      setDependencies(validDeps);
    },
    [fields]
  );

  return (
    <>
      <Stack
        justifyContent={"space-between"}
        alignItems="center"
        direction="row"
        padding="4px 8px 0 8px"
      >
        <Typography variant="h6">Dependencies</Typography>
        <Button
          size="small"
          variant="text"
          startIcon={<Plus />}
          onClick={() => prepend({ name: "", version: "", uid: v4() })}
        >
          Add
        </Button>
      </Stack>
      <Stack padding={2} spacing={2}>
        {fields.map((depField, index) => (
          <DepField
            key={depField.id}
            control={control}
            index={index}
            remove={remove}
            isDuplicateError={duplicateErrorFields.includes(depField.uid)}
            handleBlur={handleBlur}
            handleDelete={handleDelete}
          />
        ))}
      </Stack>
    </>
  );
};

type DepFieldProps = {
  control: Control<FormValues>;
  isDuplicateError: boolean;
  index: number;
  remove: UseFieldArrayRemove;
  handleBlur: (updatedField: DependencyWithId) => void;
  handleDelete: (updatedField: DependencyWithId) => void;
};
const DepField = ({
  control,
  isDuplicateError,
  index,
  remove,
  handleBlur,
  handleDelete,
}: DepFieldProps) => {
  const depField = useWatch({ name: `dependencies.${index}`, control });

  return (
    <Stack spacing={1}>
      <Stack spacing={2} direction="row" alignItems="center">
        <Controller
          name={`dependencies.${index}.name`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              error={isDuplicateError}
              placeholder="Package name"
              onBlur={() => {
                handleBlur(depField);
                field.onBlur();
              }}
              sx={{
                width: "75%"
              }}

            />
          )}
        />
        <Controller
          name={`dependencies.${index}.version`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="1.0.x"
              onBlur={() => {
                handleBlur(depField);
                field.onBlur();
              }}
              sx={{
                width: "25%"
              }}

            />
          )}
        />
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            remove(index);
            handleDelete(depField);
          }}
        >
          <Delete />
        </IconButton>
      </Stack>
      {isDuplicateError && (
        <Typography variant="body2" color="error">
          Duplicate package name
        </Typography>
      )}
    </Stack>
  );
};
