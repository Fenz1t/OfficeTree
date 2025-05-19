import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 



ModuleRegistry.registerModules([AllCommunityModule]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

