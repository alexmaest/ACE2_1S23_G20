#include <math.h>

#include <Wire.h>//Incluye libreria de bus I2C
#include <Adafruit_Sensor.h>//Incluye librerias para sensor BMP280
#include <Adafruit_BMP280.h>

#include <DHT.h>
#include <DHT_U.h>

#define Type DHT11
const float a = 17.625;
const float b = 243.04;
const float e = 2.71828;
int dhtPin = 2;
int humidity;
float tempC;
float tempF;
float tempC2;
float pression;
float dewPoint;
float alpha;
float ln;
String data;

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
  ln = log(humidity / 100.0) / log(e);
  alpha = ln + ((a * tempC) / (b + tempC));
  dewPoint = (b * alpha) / (a - alpha);
  // format data
  data = "";
  data += String(tempC);
  data += ",";
  data += String(humidity);
  data += ",";
  // TODO: humedad absoluta
  data += "12.3";
  data += ",";
  data += String(dewPoint);
  data += ",";
  // TODO: velocidad del viento
  data += "15";
  data += ",";
  // TODO: direccion del viento
  data += "1";
  data += ",";
  data += String(pression);
  Serial.println(data);
  delay(3000);
}
