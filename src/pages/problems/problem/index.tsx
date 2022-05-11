// ** MUI Imports
import { Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Editor from "../../../views/problem/Editor";
import Preview from "../../../views/problem/Preview";
import FileSystem3 from "../../../views/problem/FileSystem3";

const problemData = {
  id: "1",
  name: "Create a Tic Tac Toe game",
  description:
    "Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description. Create a Tic Tac Toe game long description",
  attempted: false,
  time: 999,
  locked: false,
};

const Problem = ({ id }: { id: string }) => {
  console.log(id);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h5">{problemData.name}</Typography>
        <Typography variant="body2">{problemData.description}</Typography>
      </Grid>
      <Grid item xs={12} height={"100%"}>
        <Stack direction="row" height={"100%"}>
          <FileSystem3 />
          <Editor />
          <Preview />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Problem;
