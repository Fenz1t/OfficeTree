import React, { useState } from 'react';
import { Box } from '@mui/material';
import OfficeTree from '../components/Offices/OfficeTree';
import EmployeesTable from '../components/Offices/EmployeesTable';


const Offices = () => {
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  return (
    <Box display="flex" gap={2}>
      <OfficeTree onBranchSelect={setSelectedBranchId}/>
      <EmployeesTable branchId={selectedBranchId} />
    </Box>
  );
};


export default Offices;