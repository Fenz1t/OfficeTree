import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllEnterpriseModule]);

ModuleRegistry.registerModules([AllEnterpriseModule]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
