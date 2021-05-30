CREATE DATABASE sha256;
use sha256;

CREATE TABLE user(
    idx INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(100) NOT NULL,
    userpw VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    joindate DATETIME DEFAULT CURRENT_TIMESTAMP
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;