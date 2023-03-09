const http = require('http');
var state = '';//Guarda el ultimo estado del sensor

const server = http.createServer((req, res) => {
  //Configurar el encabezado de respuesta HTTP
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    let body = '';
    
    //Leer los datos enviados en la solicitud
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      if (state == ''){
        if (body == 'S\r'){
          state = 'S';
        }else{
          state = 'N';
        }
      }else{
        if (state != body && body != '\r' && body != ''){
          state = body;
        }
      }
      console.log(state);
      res.end('Datos recibidos correctamente');//Devuelve esto al modulo
    });
  } else {
    res.statusCode = 200;
    res.end('Servidor Node.js funcionando correctamente');
  }
});

//Configurar el puerto y dirección IP del servidor
const port = 3000;
const ip = '0.0.0.0';

//Iniciar el servidor
server.listen(port, ip, () => {
  console.log(`Servidor escuchando en http://${ip}:${port}`);
});
