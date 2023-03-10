#include <ESP8266WiFi.h>//Librerias del modulo wifi
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "CLARO1_0FD07F";//Datos de la red local
const char* password = "62525svoTH";
const char* serverUrl = "http://192.168.1.14:3000";

WiFiClient client;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {//Comprobacion de conexion continua
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    if (Serial.available() > 0) {//Comunicacion serial con arduino
      String data = Serial.readStringUntil('\n');//Lee la cadena enviada
      int httpCode = http.POST(data);//Hace un POST con node
      if (httpCode > 0) {//Si se realiza con exito obtiene la respuesta
        String payload = http.getString();
        if(payload != ""){
          Serial.println(payload);//Devuelve el tiempo configurado en la app
        }
      } else {
        //Serial.println("Error on HTTP request");//Error en la respuesta
      }
    }
    http.end();
  } else {
    //Serial.println("WiFi disconnected");
  }
  delay(1000);
}