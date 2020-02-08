# Employee-Tracker

## Description

A database with a command line application that views, adds, updates, and deletes data pertaining to an organization's departments, roles, and employees. Intended for use as a Content Management System that tracks employees.

Includes database schema and seed in the "assets" folder.

| Technologies used:                   |
| ------------------------------------ |
| Node.js, JavaScript, Inquirer, MySQL |

## Usage

Requires MySQL, Node.js, and installation of these dependencies:

- colors
- console.table
- inquirer
- mysql

Use provided schema.sql to create a MySQL database called "employeeTracker_DB". Use seed.sql to populate the database or populate with your own data.

Save your MySQL password within the string on line 3 of employeetracker.js.

From the command line, open the Employee-Tracker folder and enter the command below to start the application.

```sh
node employeetracker.js
```

## License

© 2020 Gina Lucy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
