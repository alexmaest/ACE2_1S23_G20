from http.server import BaseHTTPRequestHandler, HTTPServer

class MyServer(BaseHTTPRequestHandler):
    
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        _body = post_data.replace("\n", "").replace("\r", "")
        if _body != '':
            print(_body) # Valores de sensores
    
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        response = "E5;" # Valor a enviar al arduino
        self.wfile.write(response.encode())

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 3556
    
    my_server = HTTPServer((host, port), MyServer)
    print(f'Servidor escuchando en http://{host}:{port}')
    try:
        my_server.serve_forever()
    except KeyboardInterrupt:
        my_server.server_close()