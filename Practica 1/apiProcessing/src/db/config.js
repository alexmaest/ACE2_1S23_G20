
const mongoose = require("mongoose");
require("dotenv").config(); // dotenv sirve para cargar las variables de entorno

mongoose.set('strictQuery', true); // strictQuery sirve para que mongoose no permita que se hagan consultas que no esten definidas en el modelo


(async () => {
  try {
    const conn = await mongoose.connect(
        `mongodb+srv://davidpc:Guatemala2022@cluster0.7zlwifm.mongodb.net/dbmetereologica?retryWrites=true&w=majority&ssl=true`
        );
    console.log("Conectado a MongoDB en db", conn.connection.name);
  } catch (error) {
    console.log(error);
  }
})();
