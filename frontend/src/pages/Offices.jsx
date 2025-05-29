import React, { useState, useRef } from "react";
import { Box, Button } from "@mui/material";
import OfficeTree from "../components/Offices/OfficeTree";
import EmployeesTable from "../components/Offices/EmployeesTable";
import Tour from "../components/Tour";

const Offices = () => {
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [tourActive, setTourActive] = useState(false);
  const tourKeyRef = useRef(0);
  const [isTourStarting, setIsTourStarting] = useState(false);


  const startTour = () => {
    if (isTourStarting) return;
  
  setIsTourStarting(true);
  tourKeyRef.current += 1;
  setTourActive(true);
  
  setTimeout(() => setIsTourStarting(false), 1000);
  };

  const endTour = () => {
    setTourActive(false);
  };

  return (
    <>
      {tourActive && (
        <Tour key={tourKeyRef.current} onFinish={endTour} />
      )}
      
      <Box display="flex" flexDirection="column" gap={2}>
        <Button 
          variant="outlined" 
          onClick={startTour}
          sx={{ alignSelf: 'flex-start' }}
        >
          Начать тур
        </Button>
      
        <Box display="flex" gap={2}>
          <OfficeTree onBranchSelect={setSelectedBranchId} />
          <EmployeesTable branchId={selectedBranchId} />
        </Box>
      </Box>
    </>
  );
};

export default Offices;