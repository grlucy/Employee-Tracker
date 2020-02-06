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

function viewData() {
  inquirer
    .prompt({
      type: "list",
      name: "viewItem",
      message: "What would you like to view?",
      choices: [
        "All departments",
        "All roles",
        "All employees",
        "Employees by manager",
        "Employees by department",
        "Total utilized budget of a specific department"
      ]
    })
    .then(answer => {
      switch (answer.viewItem) {
        case "All departments":
          connection.query(`SELECT * FROM department`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "All roles":
          connection.query(`SELECT * FROM role`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "All employees":
          connection.query(`SELECT * FROM employee`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "Employees by manager":
          // Come back to this
          startApp();
          break;
        case "Employees by department":
          connection.query(`SELECT * FROM department`, function(err, res) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  name: "deptChoice",
                  type: "rawlist",
                  message: "Which department?",
                  choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      choiceArray.push(res[i].name);
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer => {
                connection.query(
                  `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, department.name AS department_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = "${answer.deptChoice}"`,
                  function(err2, res2) {
                    if (err2) throw err2;
                    console.table(res2);
                    startApp();
                  }
                );
              });
          });
          break;
        case "Total utilized budget of a specific department":
          // come back to this
          break;
        default:
          console.log("Error, please try again");
          startApp();
      }
    });
}

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
