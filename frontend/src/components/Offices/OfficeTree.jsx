import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import OfficesService from "../../api/OfficesService";

const OfficeTree = ({ onBranchSelect, selectedBranchId }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState(null);
  const [newOffice, setNewOffice] = useState({ name: "", parentId: "" });
  const [selectedDeleteId, setSelectedDeleteId] = useState("");

  const gridRef = useRef();

  const fetchOffices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OfficesService.getAllList();
      setRowData(data);
    } catch (err) {
      setError(err.message || "Ошибка при загрузке");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handleCreate = async () => {
    try {
      await OfficesService.create({
        name: newOffice.name,
        parentId: newOffice.parentId || null,
      });
      setCreateOpen(false);
      setNewOffice({ name: "", parentId: "" });
      await fetchOffices();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await OfficesService.delete(selectedDeleteId);
      setDeleteOpen(false);
      setSelectedDeleteId("");
      await fetchOffices();
    } catch (error) {
      setError(error.message);
    }
  };

 const columnDefs = useMemo(() => [
  {
    field: "name",
    headerName: "Дерево филиалов",
    hide: true, 
  },
], []);

const autoGroupColumnDef = useMemo(() => ({
  headerName: "Дерево филиалов",          
  field: "name",                
  cellRendererParams: {
    suppressCount: true,       
  },
  flex: 1,
}), []);

  const getDataPath = useCallback(
    (data) => {
      const path = [];
      let current = data;
      const map = new Map(rowData.map((item) => [item.id, item]));
      while (current) {
        path.unshift(current.name);
        current = map.get(current.parentId);
      }
      return path;
    },
    [rowData]
  );

  const onSelectionChanged = useCallback(() => {
    const selectedNode = gridRef.current?.api.getSelectedNodes()[0];
    if (selectedNode && selectedNode.data) {
      onBranchSelect(selectedNode.data.id);
    }
  }, [onBranchSelect]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ height: "500px", width: "30%" }} data-tour="office-tree">
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          data-tour ='create-office'
          onClick={() => setCreateOpen(true)}
        >
          Создать офис
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          data-tour ='delete-office'
          onClick={() => setDeleteOpen(true)}
        >
          Удалить офис
        </Button>
      </Box>

      <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef} 
          treeData={true}
          animateRows={true}
          groupDefaultExpanded={0}
          getDataPath={getDataPath}
          rowSelection='single'
          onSelectionChanged={onSelectionChanged} 
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
        />
      </div>

      {/* Диалог создания */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} data-tour='create-office-dialog'>
        <DialogTitle>Создание нового офиса</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <TextField
            autoFocus
            fullWidth
            label="Название офиса"
            value={newOffice.name}
            onChange={(e) =>
              setNewOffice((prev) => ({ ...prev, name: e.target.value }))
            }
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Родительский офис</InputLabel>
            <Select
              value={newOffice.parentId}
              onChange={(e) =>
                setNewOffice((prev) => ({ ...prev, parentId: e.target.value }))
              }
              label="Родительский офис"
            >
              <MenuItem value="">Главный офис</MenuItem>
              {rowData.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button onClick={handleCreate} disabled={!newOffice.name.trim()}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог удаления */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Удаление офиса</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel>Выберите офис для удаления</InputLabel>
            <Select
              value={selectedDeleteId}
              onChange={(e) => setSelectedDeleteId(e.target.value)}
              label="Офис"
            >
              {rowData.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Отмена</Button>
          <Button
            onClick={handleDelete}
            disabled={!selectedDeleteId}
            color="error"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficeTree;
