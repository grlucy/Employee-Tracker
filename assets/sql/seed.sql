USE employeeTracker_DB;

INSERT INTO department (name)
VALUES ("Accounting"), ("Sales"), ("Client Services");

INSERT INTO role (title, salary, department_id)
VALUES ("Director of Accounting", 100000.00, 1),
("Senior Accountant", 85000.00, 1),
("Accountant", 50000.00, 1),
("Vice Chairman", 150000.00, 2),
("Vice President", 120000.00, 2),
("Associate", 90000.00, 2),
("Director of Client Services", 80000.00, 3),
("Account Representative", 55000.00, 3),
("Client Service Coordinator", 45000.00, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Casey", "Smith", 1), ("Bill", "Hudson", 4), ("Trish", "Talbot", 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Parker", "Hawkins", 2, 1),
("Jess", "Mully", 3, 1),
("Chris", "Haverty", 3, 1),
("Brian", "Sargent", 5, 2),
("Martha", "Fitzpatrick", 5, 2),
("Mike", "Lowry", 5, 2),
("Kemp", "Sculder", 6, 2),
("Rudy", "Forster", 6, 2),
("Jenna", "Jenkins", 8, 3),
("Cheryl", "Flores", 8, 3),
("Genevieve", "Oneil", 9, 3);

SELECT * FROM employee;