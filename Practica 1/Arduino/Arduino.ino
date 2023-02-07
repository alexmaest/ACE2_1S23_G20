#include <Wire.h>//Incluye libreria de bus I2C
#include <Adafruit_Sensor.h>//Incluye librerias para sensor BMP280
#include <Adafruit_BMP280.h>

#include <DHT.h>
#include <DHT_U.h>

#define Type DHT11
int dhtPin = 2;
int humidity;
float tempC;
float tempF;
float tempC2;
float pression;

DHT HT(2, Type);
Adafruit_BMP280 bmp;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  if(!bmp.begin()){
    Serial.print("SensorID was: 0x"); 
    Serial.println(bmp.sensorID(),16);
    while(1){Serial.println("No se ha detectado el BMP280");}
  }
  HT.begin();  
}

void loop() {
  // put your main code here, to run repeatedly:
  humidity = HT.readHumidity();
  tempC = HT.readTemperature();
  tempF = HT.readTemperature(true);
  tempC2 = bmp.readTemperature();
  pression = (bmp.readPressure()/100);
  Serial.println("Humedad relativa: " + String(humidity) + "%");
  Serial.println("Temperatura1 C: " + String(tempC));
  Serial.println("Temperatura1 F: " + String(tempF));
  Serial.println("Presion hPa: " + String(pression));
  //Serial.println("Temperatura2 C: " + String(tempC2));
  Serial.println("--------------------------------------------------------");
  delay(3000);
}
