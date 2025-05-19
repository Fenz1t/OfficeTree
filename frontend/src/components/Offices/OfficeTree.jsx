import React, { useEffect, useState, useCallback } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import OfficesService from '../../api/OfficesService';

const OfficeTree = ({ onBranchSelect, selectedBranchId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newOffice, setNewOffice] = useState({ name: '', parentId: '' });
  const [selectedDeleteId, setSelectedDeleteId] = useState('');

  const transformData = useCallback((branches) => {
    return branches.map(branch => ({
      id: branch.id.toString(),
      label: branch.name,
      children: branch.children ? transformData(branch.children) : [],
    }));
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const data = await OfficesService.getAll();
      if (Array.isArray(data)) {
        const transformedData = transformData(data);
        setItems(transformedData);
        setExpandedItems(prev => [...new Set([...prev, ...transformedData.map(item => item.id)])]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [transformData]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCreate = async () => {
    try {
      await OfficesService.create({
        name: newOffice.name,
        parentId: newOffice.parentId || null
      });
      setCreateOpen(false);
      setNewOffice({ name: '', parentId: '' });
      await fetchBranches();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await OfficesService.delete(selectedDeleteId);
      setDeleteOpen(false);
      setSelectedDeleteId('');
      await fetchBranches();
    } catch (error) {
      setError(error.message);
    }
  };

  const flattenItems = (items) => {
    return items.reduce((acc, item) => {
      acc.push(item);
      if (item.children) {
        acc.push(...flattenItems(item.children));
      }
      return acc;
    }, []);
  };

  const handleItemSelection = (event, itemId) => {
    onBranchSelect(itemId);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ minHeight: 400, flexGrow: 1, maxWidth: 300 }}>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => setCreateOpen(true)}
          fullWidth
        >
          Создать офис
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => setDeleteOpen(true)}
          fullWidth
        >
          Удалить офис
        </Button>
      </Box>


      <RichTreeView
        items={items}
        expandedItems={expandedItems}
        selectedItems={selectedBranchId ? [selectedBranchId] : []}
        onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
        onSelectedItemsChange={handleItemSelection}
        aria-label="office-tree"
      />

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Создание нового офиса</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <TextField
            autoFocus
            fullWidth
            label="Название офиса"
            value={newOffice.name}
            onChange={(e) => setNewOffice(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Родительский офис</InputLabel>
            <Select
              value={newOffice.parentId}
              onChange={(e) => setNewOffice(prev => ({ ...prev, parentId: e.target.value }))}
              label="Родительский офис"
            >
              <MenuItem value="">Главный офис</MenuItem>
              {flattenItems(items).map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.label}
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

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Удаление офиса</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel>Выберите офис для удаления</InputLabel>
            <Select
              value={selectedDeleteId}
              onChange={(e) => setSelectedDeleteId(e.target.value)}
              label="Выберите офис для удаления"
            >
              {flattenItems(items).map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={!selectedDeleteId}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OfficeTree;