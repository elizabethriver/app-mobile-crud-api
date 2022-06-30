CREATE DATABASE Contacts ; 
CREATE TABLE ContactsUser (  
    ContactID SERIAL PRIMARY KEY,  
    FirstName varchar(255) NOT NULL,  
    LastName varchar(255)NOT NULL,  
    NumberPhone varchar(255) UNIQUE NOT NULL,
);
SELECT * FROM  ContactsUser;
SELECT FirstName, LastName FROM  ContactsUser WHERE FirstName = "Juan" AND LastName = "Francisco";
INSERT INTO ContactsUser (FirstName, LastName, NumberPhone) VALUES ('Eli', 'Rivera', '980176169');
UPDATE ContactsUser SET FirstName = 'ANA', LastName = "Lira", NumberPhone = '90293232'  WHERE ContactID = 1;
DELETE FROM ContactsUser WHERE ContactID = 1;
SELECT * FROM ContactsUser WHERE ContactID = 1;
alter table ContactsUser add constraint unique_NumberPhone unique (NumberPhone);