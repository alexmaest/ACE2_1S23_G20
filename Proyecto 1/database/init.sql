CREATE DATABASE pomodoroDB;

USE pomodoroDB;

-- ------------------------------------------------------------------------------------------
-- Tablas de la base de datos
-- ------------------------------------------------------------------------------------------
CREATE TABLE Usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(64) NOT NULL,
  fullName VARCHAR(64) NOT NULL,
  password VARCHAR(24) NOT NULL,
  penalizacionPararse INT NOT NULL,
  penalizacionSentarse INT NOT NULL
);

CREATE TABLE Pomodoro (
  idPomodoro INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  fechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tiempoTrabajo INT NOT NULL,
  tiempoDescanso INT NOT NULL,
  FOREIGN KEY(idUsuario) REFERENCES Usuario(idUsuario) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Reporte (
  idReporte INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  idPomodoro INT NOT NULL,
  ciclo INT NOT NULL,
  modo INT NOT NULL,
  tiempoPenalizacion INT NOT NULL,
  minuto INT NOT NULL,
  segundo INT NOT NULL,
  fechaDato TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(idPomodoro) REFERENCES Pomodoro(idPomodoro) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------------------
-- Procedimiento para crear un usuario
-- ------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE crearUsuario(
  IN _userName VARCHAR(64),
  IN _fullName VARCHAR(64),
  IN _password VARCHAR(24)
)
BEGIN
  INSERT INTO Usuario(userName, fullName, password, penalizacionPararse, penalizacionSentarse)
  VALUES(_userName, _fullName, _password, 0, 0);
END$$
DELIMITER ;

-- ------------------------------------------------------------------------------------------
-- Procedimiento para iniciar un pomodoro
-- ------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE iniciarPomodoro(
  IN _idUsuario INT,
  IN _tiempoTrabajo INT,
  IN _tiempoDescanso INT
)
BEGIN
  INSERT INTO Pomodoro(idUsuario, tiempoTrabajo, tiempoDescanso)
  VALUES(_idUsuario, _tiempoTrabajo, _tiempoDescanso);
  UPDATE Usuario SET penalizacionPararse = 0, penalizacionSentarse = 0 WHERE idUsuario = _idUsuario;
END$$
DELIMITER ;

-- ------------------------------------------------------------------------------------------
-- Procedimiento para insertar un reporte
-- ------------------------------------------------------------------------------------------
DELIMITER $$
CREATE PROCEDURE insertarReporte(
  IN _idPomodoro INT,
  IN _ciclo INT,
  IN _modo INT,
  IN _tiempoPenalizacion INT,
  IN _minuto INT,
  IN _segundo INT
)
BEGIN
  INSERT INTO Reporte(idPomodoro, ciclo, modo, tiempoPenalizacion, minuto, segundo)
  VALUES(_idPomodoro, _ciclo, _modo, _tiempoPenalizacion, _minuto, _segundo);
END$$
DELIMITER ;

DROP DATABASE pomodoroDB;