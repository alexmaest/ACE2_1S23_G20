const http = require('http');
var time = ''; // Variable donde se almacena el tiempo a configurar
var _time = '';

const server = http.createServer((req, res) => {
  // Configurar el encabezado de respuesta HTTP
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    let body = '';

    // Leer los datos enviados en la solicitud
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      let _body = body.replace("\n", "");
      let __body = _body.replace("\r", "");
      if (__body != '') {
        console.log(__body); // Valor enviado sobre penalizacion
        fetch('http://localhost:3555/api/penalty', { // Enviar el valor a la pagina web
          method: 'POST',
          body: __body,
          headers: { 'Content-Type': 'text/plain' },
        })
      }
    });
  } else if (req.method === 'GET') {
    fetch('http://localhost:3555/api/getRest')
    .then(response => response.json())
    .then(data => {
      time = data.rest;
    })
    
    if(time != ''){
      if (_time != time) {
        res.end(time + ';'); // Responde con el tiempo a configurar
        _time = time;
      }else{
        res.end(' ');
      }
    }else{
      res.end(' ');
    }
  }
});

// Configurar el puerto y dirección IP del servidor
const port = 3556;
const ip = '0.0.0.0';

// Iniciar el servidor
server.listen(port, ip, () => {
  console.log(`Servidor escuchando en http://${ip}:${port}`);
});
