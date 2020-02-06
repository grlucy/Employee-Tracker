// Dependencies

const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

// -------------------------------------------------------------------
// Connection

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeTracker_DB"
});

connection.connect(err => {
  if (err) throw err;
  startApp();
});

// -------------------------------------------------------------------
// Functions
