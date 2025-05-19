import { Routes, Route } from 'react-router-dom';
import Offices from '../pages/Offices';
import Positions from '../pages/Positions';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import { routes } from '../routes';

const AppRouter = () => {
  return (
    <Routes>
      {routes.map((route)=>(
        <Route key={route.path} path={route.path} element={route.element}/>
      ))}
      <Route path='*'element={<div>Страница не найдена 404</div>}/>
    </Routes>
  );
};

export default AppRouter;