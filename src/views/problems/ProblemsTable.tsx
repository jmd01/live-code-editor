// ** React Imports
import { useState, ChangeEvent } from "react";

import Link from "next/link";

// ** MUI Imports
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import { match } from "ts-pattern";
import { CheckCircle } from "mdi-material-ui";
import { Lock } from "mdi-material-ui";

interface Column {
  id: "name" | "attempted" | "time" | "locked";
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  {
    id: "attempted",
    label: "Attempted",
    minWidth: 100,
    maxWidth: 100,
    align: "center",
  },
  {
    id: "time",
    label: "Time spent",
    minWidth: 170,
    align: "center",
  },
  {
    id: "locked",
    label: "Locked",
    minWidth: 100,
    maxWidth: 100,
    align: "center",
  },
];

interface Data {
  id: string;
  name: string;
  attempted: boolean;
  time: number;
  locked: boolean;
}

const rows: Data[] = [
  {
    id: "1",
    name: "Create a Tic Tac Toe game",
    attempted: false,
    time: 999,
    locked: false,
  },
  {
    id: "2",
    name: "Create a button counter with useState",
    attempted: true,
    time: 0,
    locked: false,
  },
  {
    id: "3",
    name: "Create a sliding number puzzle",
    attempted: false,
    time: 9998,
    locked: true,
  },
  {
    id: "4",
    name: "Use the SpaceX graphql API to create a list of launches",
    attempted: false,
    time: 200,
    locked: true,
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Etc/UTC",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const formatTime = (seconds: number) =>
  dateFormatter.format(new Date(seconds * 1000));

const ProblemsTable = () => {
  // ** States
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      return (
                        <TableCell key={column.id} align={column.align}>
                          {match(column)
                            .with({ id: "attempted" }, () => (
                              <CheckCircle
                                color={value ? "success" : "disabled"}
                              />
                            ))
                            .with({ id: "time" }, () =>
                              formatTime(value as number)
                            )
                            .with({ id: "locked" }, () => (
                              <Lock color={value ? "error" : "disabled"} />
                            ))
                            .otherwise(() => (
                              <Link passHref href={`problems/problem/${row.id}`}>
                                {value}
                              </Link>
                            ))}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProblemsTable;
