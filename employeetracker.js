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
  // Ask what action the user would like to take
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["View", "Add", "Update", "Delete", "Exit"]
    })
    .then(answer => {
      // route to appropriate function based on chosen action
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
  // Generate re-usable query
  function queryView(where) {
    return `
  SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, manager.first_name manager_first_name, manager.last_name manager_last_name, department.name department_name
  FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  INNER JOIN employee manager
  ON employee.manager_id = manager.id
  WHERE ${where};
  `;
  }

  // Get further info about user's desired action
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
          // Read all data in the department table and print to console
          connection.query(`SELECT * FROM department`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "All roles":
          // Read all data in the role table and print to console
          connection.query(`SELECT * FROM role`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "All employees":
          // Read all data in the employee table and print to console
          connection.query(`SELECT * FROM employee`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;
        case "Employees by manager":
          // Retrieve manager names and IDs from employee table
          connection.query(`SELECT * FROM employee`, function(err, res) {
            if (err) throw err;
            let managerIDs = [];
            for (const employee of res) {
              if (employee.manager_id !== null) {
                managerIDs.push(employee.manager_id);
              }
            }
            let uniqueIDs = [...new Set(managerIDs)];
            let managerArr = [];
            for (const employee of res) {
              if (uniqueIDs.indexOf(employee.id) > -1) {
                managerArr.push(employee);
              }
            }
            // Pass manager names to inquirer options
            inquirer
              .prompt([
                {
                  name: "mgrChoice",
                  type: "rawlist",
                  message: "Which manager?",
                  choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < managerArr.length; i++) {
                      choiceArray.push(
                        `${managerArr[i].first_name} ${managerArr[i].last_name}`
                      );
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer => {
                // Create a query using the manager name selected by user
                const answerArr = answer.mgrChoice.split(" ");
                const mgrFirst = answerArr[0];
                const mgrLast = answerArr[1];
                const query = queryView(
                  `(manager.first_name = "${mgrFirst}" AND manager.last_name = "${mgrLast}");`
                );
                // Read data specified by above query and print to console
                connection.query(query, function(err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
          break;
        case "Employees by department":
          // Read all data in the department table and pass department names to inquirer options
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
                // Create a query using the department name specified by user
                const query = queryView(
                  `department.name = "${answer.deptChoice}"`
                );
                // Read data specified by above query and print to console
                connection.query(query, function(err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
          break;
        case "Total utilized budget of a specific department":
          // Read all data in the department table and pass department names to inquirer options
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
                // Create a query using the department name specified by user
                const query = `
                SELECT department.name department_name, SUM(role.salary) utilized_budget
                FROM employee
                INNER JOIN role ON employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id
                WHERE department.name = "${answer.deptChoice}";
                `;
                // Read data specified by above query and print to console
                connection.query(query, function(err2, res2) {
                  if (err2) throw err2;
                  console.table(res2);
                  startApp();
                });
              });
          });
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
  // Print goodbye message and end connection
  console.log(
    "------ ".white.bgWhite.bold +
      "THANK YOU FOR USING EMPLOYEE TRACKER!".blue.bgWhite.bold +
      " ------\n--------------------- ".white.bgWhite.bold +
      "GOODBYE".blue.bgWhite.bold +
      " ---------------------".white.bgWhite.bold
  );
  connection.end();
}
