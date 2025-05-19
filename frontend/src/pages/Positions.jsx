import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import PositionService from "../api/PositionService";
import { useTheme } from "../contexts/ThemeContext";

const Positions = () => {
  const [rowData, setRowData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positionName, setPositionName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { agGridTheme } = useTheme();
  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const data = await PositionService.getAll();
      setRowData(data);
    } catch (error) {
      console.error("Ошибка загрузки должностей:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columnDefs = [
    { field: "name", headerName: "Должность", flex: 1 },
    {
      field: "actions",
      headerName: "Действия",
      cellRenderer: (params) => (
        <div>
          <Button
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => handleEdit(params.data)}
            style={{ marginRight: 4 }}
          >
            Изменить
          </Button>
          <Button
            color="error"
            size="small"
            variant="outlined"
            onClick={() => handleDelete(params.data.id)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setCurrentPosition(null);
    setPositionName("");
    setOpenDialog(true);
  };

  const handleEdit = (position) => {
    setCurrentPosition(position);
    setPositionName(position.name);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await PositionService.delete(id);
      await fetchPositions();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (currentPosition) {
        await PositionService.update(currentPosition.id, {
          name: positionName,
        });
      } else {
        await PositionService.create({ name: positionName });
      }
      await fetchPositions();
      setOpenDialog(false);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  return (
    <div
      theme={agGridTheme}
      style={{ height: 500, width: "100%", padding: 20}}
    >
      <div style={{ marginBottom: 16 }}>
        <Button variant="contained" onClick={handleAdd}>
          Добавить должность
        </Button>
      </div>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
        />
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {currentPosition ? "Редактирование должности" : "Новая должность"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название должности"
            fullWidth
            value={positionName}
            onChange={(e) => setPositionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Positions;
