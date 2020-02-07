// Enter your mysql password:

const myPassword = "";

// -------------------------------------------------------------------
// -------------------------------------------------------------------
// Dependencies

const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const colors = require("colors");

// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
// -------------------------------------------------------------------

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

    .then(answer1 => {
      switch (answer1.viewItem) {
        // -------------------------------------------------------------------

        case "All departments":
          // Read all data in the department table and print to console
          connection.query(`SELECT * FROM department`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;

        // -------------------------------------------------------------------

        case "All roles":
          // Read all data in the role table and print to console
          connection.query(`SELECT * FROM role`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;

        // -------------------------------------------------------------------

        case "All employees":
          // Read all data in the employee table and print to console
          connection.query(`SELECT * FROM employee`, function(err, res) {
            if (err) throw err;
            console.table(res);
            startApp();
          });
          break;

        // -------------------------------------------------------------------

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
              .then(answer2 => {
                // Create a query using the manager name selected by user
                const answerArr = answer2.mgrChoice.split(" ");
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

        // -------------------------------------------------------------------

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
              .then(answer3 => {
                // Create a query using the department name specified by user
                const query = queryView(
                  `department.name = "${answer3.deptChoice}"`
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

        // -------------------------------------------------------------------

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
              .then(answer4 => {
                // Create a query using the department name specified by user
                const query = `
                SELECT department.name department_name, SUM(role.salary) utilized_budget
                FROM employee
                INNER JOIN role ON employee.role_id = role.id
                INNER JOIN department ON role.department_id = department.id
                WHERE department.name = "${answer4.deptChoice}";
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

        // -------------------------------------------------------------------

        default:
          console.log("Error, please try again");
          startApp();
      }
    });
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------

function addData() {
  // Get further info about user's desired action
  inquirer
    .prompt({
      type: "list",
      name: "addItem",
      message: "What would you like to add?",
      choices: ["Department", "Role", "Employee"]
    })

    .then(answer5 => {
      switch (answer5.addItem) {
        // -------------------------------------------------------------------

        case "Department":
          // Get department data from user
          inquirer
            .prompt([
              {
                name: "deptName",
                type: "input",
                message: "Department name:",
                validate: function(val) {
                  return /^[a-zA-Z]+( [a-zA-Z]+)*$/gi.test(val);
                }
              }
            ])
            .then(answer6 => {
              // Create a query using user-entered department data
              const query = `
              INSERT INTO department (name)
              VALUES ("${answer6.deptName}");
              `;
              // Run query and log error or success
              connection.query(query, function(err, res) {
                if (err) throw err;
                console.log(`"${answer6.deptName}" was added to departments.`);
                startApp();
              });
            });
          break;

        // -------------------------------------------------------------------

        case "Role":
          // Read all data in the department table and pass department IDs & names to inquirer options
          connection.query(`SELECT * FROM department`, function(err, res) {
            if (err) throw err;
            // Get role data from user
            inquirer
              .prompt([
                {
                  name: "title",
                  type: "input",
                  message: "Role title:",
                  validate: function(val) {
                    return /^[a-zA-Z]+( [a-zA-Z]+)*$/gi.test(val);
                  }
                },
                {
                  name: "salary",
                  type: "number",
                  message: "Role salary:",
                  validate: function(val) {
                    return /^[0-9]+$/gi.test(val);
                  }
                },
                {
                  name: "departmentID",
                  type: "list",
                  message: "Role department ID:",
                  choices: function() {
                    let choiceArray = [];
                    for (let i = 0; i < res.length; i++) {
                      choiceArray.push(`${res[i].id} (${res[i].name})`);
                    }
                    return choiceArray;
                  }
                }
              ])
              .then(answer7 => {
                // Create a query using user-entered role data
                const answerDeptArr = answer7.departmentID.split(" ");
                const deptID = Number(answerDeptArr[0]);
                const query = `
                INSERT INTO role (title, salary, department_id)
                VALUES ("${answer7.title}", ${answer7.salary}, ${deptID});
                `;
                // Run query and log error or success
                connection.query(query, function(err, res) {
                  if (err) throw err;
                  console.log(`"${answer7.title}" was added to roles.`);
                  startApp();
                });
              });
          });
          break;

        // -------------------------------------------------------------------

        case "Employee":
          // Read all data in the role table and pass role IDs & names to inquirer options
          connection.query(`SELECT * FROM role`, function(err, roleData) {
            if (err) throw err;
            // Read all data in the employee table and pass manager IDs & names to inquirer options
            connection.query(`SELECT * FROM employee`, function(
              err2,
              managerData
            ) {
              if (err2) throw err2;
              // Get employee data from user
              inquirer
                .prompt([
                  {
                    name: "firstName",
                    type: "input",
                    message: "Employee's first name:",
                    validate: function(val) {
                      return /^[a-zA-Z]+$/gi.test(val);
                    }
                  },
                  {
                    name: "lastName",
                    type: "input",
                    message: "Employee's last name:",
                    validate: function(val) {
                      return /^[a-zA-Z]+$/gi.test(val);
                    }
                  },
                  {
                    name: "roleID",
                    type: "list",
                    message: "Employee's role ID:",
                    choices: function() {
                      let choiceArray = [];
                      for (let i = 0; i < roleData.length; i++) {
                        choiceArray.push(
                          `${roleData[i].id} (${roleData[i].title})`
                        );
                      }
                      return choiceArray;
                    }
                  },
                  {
                    name: "managerID",
                    type: "list",
                    message: "Employee's manager's ID:",
                    choices: function() {
                      let choiceArray = [];
                      for (let i = 0; i < managerData.length; i++) {
                        choiceArray.push(
                          `${managerData[i].id} (${managerData[i].first_name} ${managerData[i].last_name})`
                        );
                      }
                      return choiceArray;
                    }
                  }
                ])
                .then(answer8 => {
                  // Create a query using user-entered role data
                  const answerRoleArr = answer8.roleID.split(" ");
                  const roleID = Number(answerRoleArr[0]);
                  const answerMgrArr = answer8.managerID.split(" ");
                  const mgrID = Number(answerMgrArr[0]);
                  const query = `
                  INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ("${answer8.firstName}", "${answer8.lastName}", ${roleID}, ${mgrID});
                  `;
                  // Run query and log error or success
                  connection.query(query, function(err3, res3) {
                    if (err3) throw err3;
                    console.log(
                      `"${answer8.firstName} ${answer8.lastName}" was added to employees.`
                    );
                    startApp();
                  });
                });
            });
          });
          break;

        // -------------------------------------------------------------------

        default:
          console.log("Error, please try again");
          startApp();
      }
    });
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------

function updateData() {
  // Read all data in the employee table and pass to inquirer options
  connection.query(`SELECT * FROM employee`, function(err, res) {
    if (err) throw err;
    // Get further info about user's desired action
    inquirer
      .prompt([
        {
          name: "updateItem",
          type: "list",
          message: "What would you like to update?",
          choices: ["Employee's role", "Employee's manager"]
        },
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: function() {
            let choiceArray = [];
            for (let i = 0; i < res.length; i++) {
              choiceArray.push(
                `${res[i].id} (${res[i].first_name} ${res[i].last_name})`
              );
            }
            return choiceArray;
          }
        }
      ])

      .then(answer9 => {
        // Interpret user-entered data
        const answerEmpArr = answer9.employee.split(" ");
        const chosenEmployeeID = Number(answerEmpArr[0]);

        switch (answer9.updateItem) {
          // -------------------------------------------------------------------

          case "Employee's role":
            // Read all data in the role table and pass to inquirer options
            connection.query(`SELECT * FROM role`, function(err2, res2) {
              if (err2) throw err2;
              // Ask user for employee's updated role
              inquirer
                .prompt([
                  {
                    name: "newRole",
                    type: "list",
                    message: "What is the employee's updated role?",
                    choices: function() {
                      let choiceArray = [];
                      for (let i = 0; i < res2.length; i++) {
                        choiceArray.push(`${res2[i].id} (${res2[i].title})`);
                      }
                      return choiceArray;
                    }
                  }
                ])
                .then(answer10 => {
                  const answerRoleArr = answer10.newRole.split(" ");
                  const newRole = Number(answerRoleArr[0]);
                  connection.query(
                    `UPDATE employee SET role_id = ${newRole} WHERE id = ${chosenEmployeeID}`,
                    function(err3, res3) {
                      if (err3) throw err3;
                      console.log(`The employee's role was updated.`);
                      startApp();
                    }
                  );
                });
            });
            break;

          // -------------------------------------------------------------------

          case "Employee's manager":
            break;

          // -------------------------------------------------------------------

          default:
            console.log("Error, please try again");
            startApp();
        }
      });
  });
}

// -------------------------------------------------------------------
// -------------------------------------------------------------------

function deleteData() {}

// -------------------------------------------------------------------
// -------------------------------------------------------------------

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
