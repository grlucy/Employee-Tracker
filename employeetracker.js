// Enter your mysql password:

const myPassword = "";

// -------------------------------------------------------------------
// Dependencies

const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const colors = require("colors");

// -------------------------------------------------------------------
// Connection

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: myPassword,
  database: "employeeTracker_DB"
});

connection.connect(err => {
  if (err) throw err;
  console.log(
    "----------- ".white.bgWhite.bold +
      "WELCOME TO EMPLOYEE TRACKER!".blue.bgWhite.bold +
      " ----------".white.bgWhite.bold
  );
  startApp();
});

// -------------------------------------------------------------------
// Functions

function startApp() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View", "Add", "Update", "Delete", "Exit"]
    })
    .then(answer => {
      switch (answer.action) {
        case "View":
          viewData();
          break;
        case "Add":
          addData();
          break;
        case "Update":
          updateData();
          break;
        case "Delete":
          deleteData();
          break;
        default:
          exitApp();
      }
    });
}

function viewData() {}
function addData() {}
function updateData() {}
function deleteData() {}

function exitApp() {
  console.log(
    "------ ".white.bgWhite.bold +
      "THANK YOU FOR USING EMPLOYEE TRACKER!".blue.bgWhite.bold +
      " ------\n--------------------- ".white.bgWhite.bold +
      "GOODBYE".blue.bgWhite.bold +
      " ---------------------".white.bgWhite.bold
  );
  connection.end();
}
