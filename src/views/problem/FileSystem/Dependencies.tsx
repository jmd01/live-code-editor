import { Input, Stack, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import type { Dependency } from "src/pages/problems/problem/types";
import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  useWatch,
} from "react-hook-form";

type FormValues = {
  dependencies: Dependency[];
};

type DependenciesProps = {
  dependencies: Dependency[];
  setDependencies: Dispatch<SetStateAction<Dependency[]>>;
};
export const Dependencies = ({
  dependencies,
  setDependencies,
}: DependenciesProps) => {
  // console.log("dependencies", dependencies);
  const defaultValues = {
    dependencies: [{ name: "", version: "" }, ...(dependencies ?? [])],
  };

  // console.log("defaultValues", defaultValues);
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues,
  });

  return (
    <>
      <Typography variant="h6">Dependencies</Typography>
      <Stack padding={2} spacing={2}>
        <FieldArray control={control} setDependencies={setDependencies} />
      </Stack>
    </>
  );
};

type FieldArrayProps = {
  control: Control<FormValues>;
  setDependencies: Dispatch<SetStateAction<Dependency[]>>;
};
const FieldArray = ({ control, setDependencies }: FieldArrayProps) => {
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "dependencies", // unique name for your Field Array
    }
  );

  // console.log("fields", fields);
  return (
    <>
      {fields.map((depField, index) => (
        <DepField
          key={index}
          control={control}
          setDependencies={setDependencies}
          index={index}
        />
      ))}
    </>
  );
};

type DepFieldProps = FieldArrayProps & {
  index: number;
};
const DepField = ({ control, setDependencies, index }: DepFieldProps) => {
  const depField = useWatch({ name: `dependencies.${index}`, control });
  // console.log(depField, index);

  return (
    <Stack spacing={2} direction="row">
      {/* {console.log("depField", depField)} */}
      <Controller
        name={`dependencies.${index}.name`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Package name"
            onBlur={(e) => {
              if (e.target.value && depField.version) {
                setDependencies((deps) => [
                  ...deps,
                  { name: e.target.value, version: depField.version },
                ]);
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
            placeholder="* or 1.0.x"
            onBlur={(e) => {
              console.log("onBlur", e.target.value, depField.name);
              if (e.target.value && depField.name) {
                setDependencies((deps) => [
                  ...deps,
                  { name: depField.name, version: e.target.value },
                ]);
              }
              field.onBlur();
            }}
          />
        )}
      />
    </Stack>
  );
};
