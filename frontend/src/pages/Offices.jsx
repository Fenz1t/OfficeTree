import React, { useState } from 'react';
import { Box } from '@mui/material';
import OfficeTree from '../components/Offices/OfficeTree';
import EmployeesTable from '../components/Offices/EmployeesTable';


const Offices = () => {
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  return (
    <Box display="flex" gap={4} p={2}>
      <OfficeTree onBranchSelect={setSelectedBranchId} />
      <Box flexGrow={1}>
        <EmployeesTable branchId={selectedBranchId} />
      </Box>
    </Box>
  );
};

export default Offices;