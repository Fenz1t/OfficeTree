const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./db");
const { branchRoutes, positionRoutes,employeeRoutes,reportRoutes } = require('./Routes');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/branches',branchRoutes);//работает
app.use('/positions',positionRoutes);//работает
app.use('/employees',employeeRoutes);// в процессе разработки
app.use('/reports',reportRoutes);

app.get("/", function (req, res) {
  res.send("Main");
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
