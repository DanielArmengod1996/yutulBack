DROP DATABASE `yutul`;

CREATE DATABASE `yutul`;
USE `yutul`;

CREATE TABLE IF NOT EXISTS usuarios
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `lastname` VARCHAR(50) NOT NULL,
    `nick` VARCHAR(50) NOT NULL,
    `email`VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `city` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS videos
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `tags` VARCHAR(50) NOT NULL,
    `localizacionVideo` VARCHAR(100) NOT NULL,
    `localizacionImage` VARCHAR(100) NOT NULL,
    `likes` INT DEFAULT 0,

    `id_usuario` INT,
        FOREIGN KEY(id_usuario)
        REFERENCES usuarios(id)
);