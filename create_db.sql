# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

# Table for user details
CREATE TABLE IF NOT EXISTS userDetails (
    userID      INT AUTO_INCREMENT ,
    username    VARCHAR(255) NOT NULL,
    fname       VARCHAR(255) NOT NULL,
    lname       VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    hashedPass  VARCHAR(255) NOT NULL,
    PRIMARY KEY(userID));

# Audit table
CREATE TABLE IF NOT EXISTS loginAudit (
    id          INT AUTO_INCREMENT ,
    username    VARCHAR(255) NOT NULL,
    attemptRslt VARCHAR(50) NOT NULL,
    ip_address  VARCHAR(255),
    attemptTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id));


# Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
