#include <ESP8266WiFi.h>//Librerias del modulo wifi
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "CLARO1_0FD07F";//Datos de la red local
const char* password = "62525svoTH";
const char* serverUrl = "http://192.168.1.14:3556";

WiFiClient client;
HTTPClient http;

unsigned long lastRequestTime = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
}

void loop() {
  unsigned long currentTime = millis();
  if (WiFi.status() == WL_CONNECTED) {//Comprobacion de conexion continua
     if (Serial.available() > 0) {
      String data = Serial.readStringUntil(';');
      delay(500);
      http.begin(client, serverUrl);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      http.POST(data);
      http.end();
    }
    if (currentTime - lastRequestTime >= 3000) {
      lastRequestTime = currentTime;
      http.begin(client, serverUrl);
      int httpCode = http.GET();
      if (httpCode > 0) {
        String payload = http.getString();
        if (!payload.isEmpty()) {
          Serial.println(payload);
        }
      }
      http.end();
    }
  } else {
    //Serial.println("WiFi disconnected");
  }
}