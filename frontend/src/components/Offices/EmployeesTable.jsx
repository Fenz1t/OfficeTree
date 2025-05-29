import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import OfficesService from "../../api/OfficesService";
import EmployeeService from "../../api/EmployeeService";
import PositionService from "../../api/PositionService";

const EmployeesTable = ({ branchId }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [positions, setPositions] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    positionId: "",
    salary: "",
    hireDate: "",
    birthDate: "",
  });

  const columnDefs = [
    {
      field: "fullName",
      headerName: "ФИО",
      flex: 1,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "positionId",
      headerName: "Должность",
      valueGetter: (params) => {
        const position = positions.find((p) => p.id === params.data.positionId);
        return position?.name || "";
      },
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      field: "salary",
      headerName: "Оклад",
      filter: "agNumberColumnFilter",
      floatingFilter: true,
    },
    {
      field: "birthDate",
      headerName: "Дата рождения",
      filter: "agDateColumnFilter",
      floatingFilter: true,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    {
      field: "hireDate",
      headerName: "Дата приема",
      filter: "agDateColumnFilter",
      floatingFilter: true,
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    {
      field: "actions",
      headerName: "Действия",
      cellRenderer: (params) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            data-tour="edit-employee"
            onClick={() => handleEdit(params.data)}
            style={{ marginRight: "8px" }}
          >
            Изменить
          </Button>
          <Button
            variant="outlined"
            data-tour="delete-employee"
            color="error"
            size="small"
            onClick={() => handleDelete(params.data.id)}
          >
            Удалить
          </Button>
        </div>
      ),
      filter: false,
      sortable: false,
    },
  ];

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await PositionService.getAll();
        setPositions(data);
      } catch (error) {
        console.error("Ошибка загрузки должностей:", error);
      }
    };
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const data = await OfficesService.getAllEmployeesByBranch(branchId);
      setRowData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [branchId]);

  const handleCreate = () => {
    setCurrentEmployee(null);
    setFormData({
      fullName: "",
      positionId: "",
      salary: "",
      hireDate: "",
      birthDate: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      positionId: employee.positionId || "",
      salary: employee.salary,
      hireDate: employee.hireDate,
      birthDate: employee.birthDate,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (employeeId) => {
    try {
      await EmployeeService.delete(employeeId);
      await fetchEmployees();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const employeeData = {
        ...formData,
        branchId: branchId,
      };

      if (currentEmployee) {
        await EmployeeService.update(currentEmployee.id, employeeData);
      } else {
        await EmployeeService.create(employeeData);
      }

      await fetchEmployees();
      setOpenDialog(false);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: 500, width: "100%" }}
      data-tour="employees-table"
    >
      <div style={{ marginBottom: "16px" }}>
        <Button
          data-tour="create-employee"
          variant="contained"
          color="primary"
          onClick={handleCreate}
          disabled={loading}
        >
          Создать сотрудника
        </Button>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentEmployee ? "Редактирование сотрудника" : "Новый сотрудник"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ФИО"
            fullWidth
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />

          <FormControl fullWidth margin="dense" required>
            <InputLabel>Должность</InputLabel>
            <Select
              value={formData.positionId}
              label="Должность"
              onChange={(e) =>
                setFormData({ ...formData, positionId: e.target.value })
              }
            >
              {positions.map((position) => (
                <MenuItem key={position.id} value={position.id}>
                  {position.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Оклад"
            type="number"
            fullWidth
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
            required
          />

          <TextField
            margin="dense"
            label="Дата рождения"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            required
          />

          <TextField
            margin="dense"
            label="Дата приема"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.hireDate}
            onChange={(e) =>
              setFormData({ ...formData, hireDate: e.target.value })
            }
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={
              !formData.fullName ||
              !formData.positionId ||
              !formData.birthDate ||
              !formData.hireDate
            }
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Box display="flex" justifyContent="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Загрузка...</span>'
          }
          overlayNoRowsTemplate={
            '<span class="ag-overlay-loading-center">Выберите филиал для получения сотрудников</span>'
          }
        />
      )}
    </div>
  );
};

export default EmployeesTable;
