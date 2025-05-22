import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import ReportService from "../api/ReportService";

const Reports = () => {
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const columnDefs = useMemo(() => [
    { 
      field: "name",
      headerName: "Название филиала",
      flex: 2,
      cellRenderer: 'agGroupCellRenderer',
    },
    { 
      field: "employees.length",
      headerName: "Кол-во сотрудников",
      flex: 1,
      filter: "agNumberColumnFilter",
      valueGetter: params => params.data.employees.length
    }
  ], []);

  const detailCellRendererParams = useMemo(() => ({
    detailGridOptions: {
      columnDefs: [
        { field: "fullName", headerName: "Сотрудник", flex: 2 },
        { field: "salary", headerName: "Оклад", flex: 1 },
        { field: "branchName", headerName: "Филиал", flex: 1 }
      ],
      defaultColDef: {
        flex: 1,
        sortable: true,
        filter: true
      }
    },
    getDetailRowData: params => {
      params.successCallback(params.data.employees);
    }
  }), []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await ReportService.generate();
        setRowData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getRowId = useMemo(() => (params) => {
    return params.data.id.toString();
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
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Сотрудники со стажем {">"} 3 лет и окладом {"<"} 30000
      </Typography>

      <div 
        className="ag-theme-alpine"
        style={{ 
          height: 600, 
          width: '100%',
          fontSize: '16px'
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          masterDetail={true}
          detailCellRendererParams={detailCellRendererParams}
          getRowId={getRowId}
          animateRows={true}
          groupDefaultExpanded={0}
          detailRowHeight={300}
          rowSelection={{
            enableClickSelection:true,
          }}
        />
      </div>
    </Paper>
  );
};

export default Reports;
