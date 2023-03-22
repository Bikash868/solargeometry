import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

//"hr", "dh1" ,"dh2", "y1" ,"y2", "rads" ,"start_ang", "end_ang"
const columns = [
  {
    id: "hr",
    label: "hr",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "dh1",
    label: "dh1",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "dh2",
    label: "dh2",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "y1",
    label: "y1",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "y2",
    label: "y2",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "rads",
    label: "rads",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "start_ang",
    label: "start_ang",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
  {
    id: "end_ang",
    label: "end_ang",
    minWidth: 10,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(hr, dh1, dh2, y1, y2, rads, start_ang, end_ang) {
  return { hr, dh1, dh2, y1, y2, rads, start_ang, end_ang };
}

export default function ColumnGroupingTable({ result, userName, cityName }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let arr = [];
    result.forEach((item) => {
      arr.push(createData(...item));
    });
    setRows(arr);
  }, [result]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <Paper sx={{ width: "100%",boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", mt:'1em' }}>
      <TableContainer sx={{ maxHeight: 440, minWidth: 750 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={4}>
                Location: {cityName}
              </TableCell>
              <TableCell align="center" colSpan={4}>
                User: {userName}
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
            //   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      */}
    </Paper>
  );
}
