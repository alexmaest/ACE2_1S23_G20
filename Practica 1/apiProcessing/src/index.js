const express = require('express') // express sirve para crear el servidor
const cors = require('cors') // cors sirve para permitir el acceso a la API desde cualquier origen
const morgan = require('morgan') // morgan sirve para ver las peticiones que se hacen a la API
/* const SerialPort = require('serialport').SerialPort;
const { DelimiterParser } = require('@serialport/parser-delimiter'); */
require('./db/config.js') // se importa el archivo de configuracion de la base de datos
const fetch = require('node-fetch')

const app = express()
const port = 3001
//
const corsOptions = { origin: true, OptionsSuccessStatus: 200 } // origin: true permite el acceso desde cualquier origen y OptionsSuccessStatus: 200 es para que el navegador no muestre un error
//
/* const usbPort = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = usbPort.pipe(new DelimiterParser({ delimiter: '\n' })); */

const directions = { 0: 'N', 1: 'E', 2: 'S', 3: 'O' }

app.use(cors(corsOptions)) // se usa cors con las opciones que se definieron arriba
app.use(express.json({ extended: true })) // se usa express.json para que el servidor entienda los datos que se envian en formato json y extended: true es para que el servidor entienda datos mas complejos;
app.use(express.urlencoded({ extended: true })) // se usa express.urlencoded para que el servidor entienda los datos que se envian en formato urlencoded y extended: true es para que el servidor entienda datos mas complejos;
app.use(morgan('dev')) // se usa morgan para ver las peticiones que se hacen a la API

app.use('/api', require('./routes/routes.js')) // se usa el archivo de rutas

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* parser.on('open', () => {
  console.log('Serial Port Opened');
});

parser.on('data', (data) => {
  var decoder = new TextDecoder();
  var arr = new Uint8Array(data);
  var info = decoder.decode(arr);
  var info_array = info.split(',');
  //obtener dia mes y año
  var date = new Date();
  date.setHours(date.getHours() - 6);//para formato UTC-6 guatemala
  var dateEnUTC = date.toUTCString();


  var res = {
    "temp": Number(info_array[0]),
    "hum": Number(info_array[1]),
    "abs_hum": Number(info_array[2]),
    "dew_point": Number(info_array[3]),
    "vel": Number(info_array[4]),
    "dir": directions[Number(info_array[5])],
    "pre": Number(info_array[6]),
    "date": dateEnUTC
  };
  enviarInfo(res);
});

parser.on('error', (err) => {
  console.log(err);
}); */

//functin para enviar info en ruta /api/enviar
function enviarInfo(json = {}) {
  fetch('http://localhost:3001/api/enviar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
}
