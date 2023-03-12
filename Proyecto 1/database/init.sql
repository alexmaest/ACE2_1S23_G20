-- Create Database
CREATE DATABASE proyecto1_ace1_db;

-- Use Database
USE proyecto1_ace1_db;

-- Create Table Usuario
CREATE TABLE usuario (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id)
) ENGINE=INNODB;

-- Create Table Pomodoro
CREATE TABLE pomodoro (
    pomodoro_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_time INT NOT NULL,
    rest_time INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    PRIMARY KEY (pomodoro_id),
    FOREIGN KEY (user_id) REFERENCES usuario(user_id)
) ENGINE=INNODB;

-- Create Table Tarea
CREATE TABLE task (
    task_id INT NOT NULL AUTO_INCREMENT,
    pomodoro_id INT NOT NULL,
    task_type VARCHAR(10) NOT NULL,
    PRIMARY KEY (task_id),
    FOREIGN KEY (pomodoro_id) REFERENCES pomodoro(pomodoro_id)
) ENGINE=INNODB;

-- Trigger to check uf type is valid
DELIMITER $$
CREATE TRIGGER check_task_type BEFORE INSERT ON task
FOR EACH ROW
BEGIN
    IF NEW.task_type NOT IN ('trabajo', 'descanso') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid task type';
    END IF;
END$$
DELIMITER ;

-- Create Table Historial
CREATE TABLE history (
    history_id INT NOT NULL AUTO_INCREMENT,
    task_id INT NOT NULL,
    is_seated BOOLEAN NOT NULL,
    is_penalized BOOLEAN NOT NULL,
    current_time DATETIME NOT NULL,
    PRIMARY KEY (history_id),
    FOREIGN KEY (task_id) REFERENCES usuario(task_id),
) ENGINE=INNODB;

-- Procedure to insert in history
DELIMITER $$
CREATE PROCEDURE insert_history(IN _task_id INT, IN _is_seated BOOLEAN)
BEGIN
    DECLARE _task_type VARCHAR(10);
    DECLARE _current_time DATETIME;
    DECLARE _is_penalized BOOLEAN;

    SELECT task_type INTO _task_type FROM task WHERE task_id = _task_id;
    SET current_time = NOW();

    IF _task_type = 'trabajo' THEN
        SET _is_penalized = NOT _is_seated;
    ELSE
        SET _is_penalized = _is_seated;
    END IF;

    INSERT INTO history (task_id, is_seated, is_penalized, current_time)
    VALUES (_task_id, _is_seated, _is_penalized, _current_time);

END$$
DELIMITER ;

