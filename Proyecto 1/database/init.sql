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

DROP DATABASE pomodoroDB;