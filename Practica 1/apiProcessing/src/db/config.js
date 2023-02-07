
const mongoose = require("mongoose");
require("dotenv").config(); // dotenv sirve para cargar las variables de entorno

mongoose.set('strictQuery', true); // strictQuery sirve para que mongoose no permita que se hagan consultas que no esten definidas en el modelo


(async () => {
  try {
    const conn = await mongoose.connect(
        `mongodb+srv://edinmv:${process.env.PASSWORD_MONGO}@cluster0.7zlwifm.mongodb.net/${process.env.DB_MONGO}?retryWrites=true&w=majority`
        );
    console.log("Conectado a MongoDB en db", conn.connection.name);
  } catch (error) {
    console.log(error);
  }
})();
