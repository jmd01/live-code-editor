import {
  Button,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import type { Dependency } from "src/pages/problems/problem/types";
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  useWatch,
  UseFieldArrayRemove,
  FieldArrayWithId,
} from "react-hook-form";
import Plus from "mdi-material-ui/Plus";
import Delete from "mdi-material-ui/Delete";

type FormValues = {
  dependencies: Dependency[];
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
    dependencies: [, ...(dependencies ?? [{ name: "", version: "" }])],
  };

  const { control } = useForm<FormValues>({
    defaultValues,
  });

  const { prepend, remove, fields } = useFieldArray({
    control,
    name: "dependencies",
  });

  const [duplicateErrorFields, setDuplicateErrorFields] = useState<Set<string>>(
    new Set()
  );

  console.log("dependencies", dependencies);

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
          onClick={() => prepend({ name: "", version: "" })}
        >
          Add
        </Button>
      </Stack>
      <Stack padding={2} spacing={2}>
        {fields.map((depField, index) => (
          <DepField
            key={depField.id}
            control={control}
            dependencies={dependencies}
            setDependencies={setDependencies}
            index={index}
            remove={remove}
            fields={fields}
            setDuplicateErrorFields={setDuplicateErrorFields}
            isDuplicateError={duplicateErrorFields.has(depField.id)}
          />
        ))}
      </Stack>
    </>
  );
};

type DepFieldProps = {
  control: Control<FormValues>;
  dependencies: Dependency[] | undefined;
  setDependencies: Dispatch<SetStateAction<Dependency[] | undefined>>;
  setDuplicateErrorFields: Dispatch<SetStateAction<Set<string>>>;
  isDuplicateError: boolean;
  index: number;
  remove: UseFieldArrayRemove;
  fields: FieldArrayWithId<FormValues, "dependencies", "id">[];
};
const DepField = ({
  control,
  setDependencies,
  dependencies,
  setDuplicateErrorFields,
  isDuplicateError,
  index,
  remove,
  fields,
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
              onBlur={(e) => {
                console.log("dependencies", dependencies);
                debugger;

                // Duplicate package names are not allowed
                console.log(
                  e.target.value,
                  fields,
                  fields.some((field) => field.name === e.target.value)
                );
                if (
                  e.target.value &&
                  fields.some((field) => field.name === e.target.value)
                ) {
                  // If changing from valid to invalid, the valid name will be in deps[]
                  // So we need to remove it
                  if (!isDuplicateError) {
                    setDependencies((dependencies) => {
                      const filteredDeps = (dependencies ?? []).filter(
                        ({ name }) => name !== fields[index].name
                      );
                      console.log(
                        "dependencies",
                        dependencies,
                        "filteredDeps",
                        filteredDeps
                      );
                      return filteredDeps;
                    });
                  }

                  const duplicateFieldIds = fields
                    .filter((field) => field.name === e.target.value)
                    .map(({ id }) => id);

                  setDuplicateErrorFields((errorFields) => new Set([
                    ...duplicateFieldIds,
                    ...errorFields
                  ]));

                  field.onBlur();
                  return;
                } else {
                  const idsToRemove = fields
                    .filter((f) => f.name === field.value)
                    .map(({ id }) => id);

                    setDuplicateErrorFields((errorFields) => {
                      const filteredFields = [...errorFields].filter(id => !idsToRemove.includes(id))
                      return new Set([
                        ...filteredFields
                      ]);
                    });
                  }

                if (e.target.value && depField.version) {
                  setDependencies((dependencies) => {
                    const filteredDeps = (dependencies ?? []).filter(
                      ({ name }) => name !== fields[index].name
                    );
                    const updatedDeps = [
                      ...filteredDeps,
                      { name: e.target.value, version: depField.version },
                    ];
                    console.log(
                      "dependencies",
                      dependencies,
                      "filteredDeps",
                      filteredDeps,
                      "updatedDeps",
                      updatedDeps
                    );
                    return updatedDeps;
                  });
                } else {
                  if (e.target.value) {
                    setDependencies((dependencies) => {
                      const updatedDeps = dependencies?.filter(({ name }) => {
                        console.log(
                          "dependencies",
                          dependencies,
                          "name",
                          name,
                          "fields[index].name",
                          fields[index].name
                        );

                        return name !== fields[index].name;
                      });
                      console.log(
                        "dependencies",
                        dependencies,
                        "updatedDeps",
                        updatedDeps
                      );
                      return updatedDeps;
                    });
                  } else {
                    setDependencies((dependencies) => {
                      const updatedDeps = dependencies?.filter((dep) =>
                        fields.map((field) => field.name).includes(dep.name)
                      );
                      console.log(
                        "dependencies",
                        dependencies,
                        "updatedDeps",
                        updatedDeps
                      );
                      return updatedDeps;
                    });
                  }
                }

                field.onBlur();
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
              onBlur={(e) => {
                console.log("onBlur", e.target.value, depField.name);
                if (
                  e.target.value &&
                  fields.some((field) => field.name === depField.name)
                ) {
                  // setDuplicateError(true);
                  field.onBlur();
                  return;
                } else {
                  // setDuplicateError(false);
                }

                if (e.target.value && depField.name) {
                  setDependencies((dependencies) => {
                    const filteredDeps = (dependencies ?? []).filter(
                      ({ name }) => name !== fields[index].name
                    );

                    const updatedDeps = [
                      ...filteredDeps,
                      { name: depField.name, version: e.target.value },
                    ];
                    console.log(
                      "dependencies",
                      dependencies,
                      "filteredDeps",
                      filteredDeps,
                      "updatedDeps",
                      updatedDeps
                    );
                    return updatedDeps;
                  });
                } else {
                  setDependencies((dependencies) => {
                    const updatedDeps = dependencies?.filter(
                      ({ name }) => name !== fields[index].name
                    );
                    console.log(
                      "dependencies",
                      dependencies,
                      "updatedDeps",
                      updatedDeps
                    );
                    return updatedDeps;
                  });
                }
                field.onBlur();
              }}
            />
          )}
        />
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => {
            remove(index);
            if (depField.name) {
              setDependencies((dependencies) => {
                const updatedDeps = dependencies?.filter(
                  ({ name }) => name !== fields[index].name
                );
                console.log(
                  "dependencies",
                  dependencies,
                  "updatedDeps",
                  updatedDeps
                );
                return updatedDeps;
              });
            }
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
