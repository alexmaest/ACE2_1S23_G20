const express = require('express');
const router = express.Router();

const { consulta1 } = require('../consultas/query.js');
//ruta para obtener colecciones de mongo db
router.get('/', consulta1);


module.exports = router;

