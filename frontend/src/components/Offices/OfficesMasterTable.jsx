import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import OfficeService from '../../api/OfficesService';
import 'ag-grid-enterprise';

const OfficesTree = () => {
  const [rowData, setRowData] = useState([]);

  // Колонки офисов
  const columnDefs = useMemo(() => [
    { field: 'name', headerName: 'Офис', rowGroup: true, hide: true },
    { field: 'level', headerName: 'Уровень', width: 120 },
    { field: 'region', headerName: 'Регион', flex: 1 },
  ], []);

  // Столбец, по которому группируются офисы (визуально)
  const autoGroupColumnDef = useMemo(() => ({
    headerName: 'Название',
    field: 'name',
    cellRendererParams: {
      suppressCount: true,
    },
    minWidth: 300,
  }), []);

  // Загружаем сотрудников для раскрытой строки
  const getDetailRowData = useCallback(async (params) => {
    try {
      const employees = await OfficeService.getAllEmployeesByBranch(params.data.id);
      params.successCallback(employees);
    } catch (err) {
      console.error('Ошибка загрузки сотрудников:', err);
      params.successCallback([]);
    }
  }, []);

  const detailCellRendererParams = useMemo(() => ({
    getDetailRowData,
    detailGridOptions: {
      columnDefs: [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Имя', flex: 1 },
        { field: 'position', headerName: 'Должность', flex: 1 },
      ],
      defaultColDef: {
        flex: 1,
        sortable: true,
        filter: true,
      },
      domLayout: 'autoHeight',
    }
  }), [getDetailRowData]);

  const fetchOffices = useCallback(async () => {
    try {
      const offices = await OfficeService.getAll();
      setRowData(offices);
    } catch (error) {
      console.error('Ошибка загрузки офисов:', error);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        autoGroupColumnDef={autoGroupColumnDef}
        masterDetail={true}
        detailCellRendererParams={detailCellRendererParams}
        groupDefaultExpanded={-1}
        animateRows={true}
        defaultColDef={{
          sortable: true,
          filter: true,
        }}
        isRowMaster={(dataItem) => true} // каждая строка может быть master
      />
    </div>
  );
};

export default OfficesTree;
