import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import ReportService from "../api/ReportService";

const Row = ({ branch }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{branch.name}</TableCell>
        <TableCell>{branch.employees.length}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Сотрудник</TableCell>
                  <TableCell>Оклад</TableCell>
                  <TableCell>Филиал</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branch.employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.salary}</TableCell>
                    <TableCell>{employee.branchName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Reports = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await ReportService.generate();
        setBranches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center" mt={4}>
        Ошибка: {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}  sx={{
    mt: 4,
    '& .MuiTableCell-root': {
      fontSize: '16px', 
    },
  }} >
      <Typography variant="h5" gutterBottom p={2}>
        Сотрудники со стажем {">"} 3 лет и окладом {"<"} 30000
      </Typography>

      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell/>
              <TableCell>Название филиала</TableCell>
            <TableCell>Кол-во сотрудников</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {branches.map((branch) => (
            <Row key={branch.id} branch={branch} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Reports;
