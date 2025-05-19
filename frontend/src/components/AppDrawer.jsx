import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider,Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { routes } from '../routes';
import React from 'react';


const AppDrawer = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        '& .MuiDrawer-paper': { width: 240 }
      }}
    >
       
        <Typography sx={{textAlign:"left",p:2,fontWeight:"bold",fontSize:'40px'}}>OfficeTree</Typography>
      <List>
        {routes.map((route, index) => (
          <React.Fragment key={route.path}>
            <ListItem 
              button
              component={NavLink}
              to={route.path}
              selected={location.pathname === route.path}
              sx={{
                '&.active': { 
                  backgroundColor: '#1976d2',
                  color:"#FFFFFF"
                }
              }}
            >
              <ListItemIcon>{route.iconComponent}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItem>
            {index === 2 && <Divider sx={{ my: 1,borderColor: '#0d6efd' }} />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;