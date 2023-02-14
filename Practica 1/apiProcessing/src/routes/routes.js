const express = require('express');
const router = express.Router();

const { consulta1, enviarDatos, consulta2 } = require('../consultas/query.js');

//ruta para obtener colecciones de mongo db
router.get('/', consulta1);
router.post('/consulta2', consulta2);
router.post('/enviar', enviarDatos);




module.exports = router;

