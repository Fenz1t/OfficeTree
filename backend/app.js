const express = require("express");
const path = require("path")
const dotenv = require("dotenv");
const sequelize = require("./db");
const expressLayouts = require('express-ejs-layouts'); 
const { branchRoutes, positionRoutes,employeeRoutes,reportRoutes,viewPositionRoutes,viewReportRoutes,viewBranchRoutes } = require('./Routes');
const methodOverride = require('method-override');
const cors = require('cors');


dotenv.config();

const app = express();
app.use(cors({
  origin:'http://localhost:5000'// - для фронтенда
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname,'public')));

//API
app.use('/api/branches',branchRoutes);
app.use('/api/positions',positionRoutes);
app.use('/api/employees',employeeRoutes);
app.use('/api/reports',reportRoutes);

//EJS
app.use('/positions',viewPositionRoutes);
app.use('/reports',viewReportRoutes);
app.use('/branches',viewBranchRoutes);


app.get('/',(req,res)=>{
  res.redirect('/branches')
});

//Отдельный роут для настроек
app.get('/settings',(req,res)=>{
  res.render('pages/settings/index',{
    title:'Настройки',
    activePage:'settings'
  })
});

const PORT = process.env.APP_PORT || 5000;
const HOST = process.env.APP_HOST || "localhost";

async function initializeApp() {
  try {
    await sequelize.authenticate();
    console.log("Database conected");

    app.listen(PORT, HOST, () => {
      console.log(`Server started on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
}
initializeApp();
