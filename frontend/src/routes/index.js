import Offices from '../pages/Offices';
import Positions from '../pages/Positions';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

import {
  Business as OfficesIcon,
  Work as PositionsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export const routes = [
  { 
    path: '/', 
    element: <Offices />,
    name: 'Офисы',
    iconComponent: <OfficesIcon /> 
  },
  { 
    path: '/positions', 
    element: <Positions />,
    name: 'Должности',
    iconComponent: <PositionsIcon />
  },
  { 
    path: '/reports', 
    element: <Reports />,
    name: 'Отчеты',
    iconComponent: <ReportsIcon />
  },
  { 
    path: '/settings', 
    element: <Settings />,
    name: 'Настройки',
    iconComponent: <SettingsIcon />
  }
];