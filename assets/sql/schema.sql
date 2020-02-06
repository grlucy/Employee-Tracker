DROP DATABASE IF EXISTS employeeTracker_DB;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department (
 id INTEGER(11) AUTO_INCREMENT NOT NULL,
 name VARCHAR(30) NULL,
 PRIMARY KEY (id)
);

CREATE TABLE role (
id INTEGER(11) AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NULL,
salary DECIMAL(13, 2) NULL,
department_id INTEGER(11) NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
 id INTEGER(11) AUTO_INCREMENT NOT NULL,
 first_name VARCHAR(30) NULL,
 last_name VARCHAR(30) NULL,
 role_id INTEGER(11) NULL,
 manager_id INTEGER(11) NULL,
 PRIMARY KEY (id),
 FOREIGN KEY (role_id) REFERENCES role(id),
 FOREIGN KEY (manager_id) REFERENCES employee(id)
);
