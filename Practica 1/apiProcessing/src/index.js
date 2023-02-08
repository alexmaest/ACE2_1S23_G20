const express = require('express'); // express sirve para crear el servidor
const cors = require('cors'); // cors sirve para permitir el acceso a la API desde cualquier origen
const morgan = require('morgan'); // morgan sirve para ver las peticiones que se hacen a la API
const serialPort = require('serialport'); // serialport sirve para comunicarse con el puerto serial`
require('./db/config.js'); // se importa el archivo de configuracion de la base de datos

const app = express();
const port = 3001;

const corsOptions = { origin: true, OptionsSuccessStatus: 200 }; // origin: true permite el acceso desde cualquier origen y OptionsSuccessStatus: 200 es para que el navegador no muestre un error

const usbPort = new serialPort('COM3', { baudRate: 9600 }); // se crea un puerto serial con el puerto COM3 y una velocidad de 9600 baudios
const parser = new serialPort.parsers.Readline(); // se crea un parser para leer los datos que se envian por el puerto serial

app.use(cors(corsOptions)); // se usa cors con las opciones que se definieron arriba
app.use(express.json({ extended: true })); // se usa express.json para que el servidor entienda los datos que se envian en formato json y extended: true es para que el servidor entienda datos mas complejos;
app.use(express.urlencoded({ extended: true })); // se usa express.urlencoded para que el servidor entienda los datos que se envian en formato urlencoded y extended: true es para que el servidor entienda datos mas complejos;
app.use(morgan('dev')); // se usa morgan para ver las peticiones que se hacen a la API

app.use('/api', require('./routes/routes.js')); // se usa el archivo de rutas

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

usbPort.pipe(parser); // se usa el parser para leer los datos que se envian por el puerto serial

parser.on('data', (data) => { // se crea un evento para cuando se reciban datos por el puerto serial
  console.log(data); // se imprime en consola los datos que se reciben por el puerto serial
});
