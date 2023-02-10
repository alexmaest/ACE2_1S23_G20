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
int pinNorth = 3;
int pinSouth = 5;
int pinEast = 4;
int pinWest = 6;
int humidity;
float tempC;
float tempF;
float tempC2;
float pression;
float dewPoint;
float alpha;
float ln;
float velocity1 = 0;
float velocity2 = 0;
int state1 = 0;
int state2 = 0;
int state3 = 0;
int state4 = 0;
int direction = 1;
String data;

DHT HT(2, Type);
Adafruit_BMP280 bmp;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(pinNorth,INPUT);
  pinMode(pinSouth,INPUT);
  pinMode(pinEast,INPUT);
  pinMode(pinWest,INPUT);

  if(!bmp.begin()){
    Serial.print("SensorID was: 0x"); 
    Serial.println(bmp.sensorID(),16);
    while(1){Serial.println("No se ha detectado el BMP280");}
  }
  HT.begin();  
}

void loop() {
  // put your main code here, to run repeatedly:
  state1 = digitalRead(pinNorth);
  state2 = digitalRead(pinSouth);
  state3 = digitalRead(pinEast);
  state4 = digitalRead(pinWest);
  
  humidity = HT.readHumidity();
  tempC = HT.readTemperature();
  tempF = HT.readTemperature(true);
  tempC2 = bmp.readTemperature();
  pression = (bmp.readPressure()/100);
  
  ln = log(humidity / 100.0) / log(e);
  alpha = ln + ((a * tempC) / (b + tempC));
  dewPoint = (b * alpha) / (a - alpha);
  
  velocity1 = analogRead(A0); // lectura de sensor a0
  velocity2 = (velocity1*0.190); // 0,190 corresponde a la pendiente de la curva aca deben poner el numero que calcularon
  
  if(state1 == 0){
    direction = 2;
    Serial.println("Viento viene del sur");
  }else if(state2 == 0){
    direction = 0;
    Serial.println("Viento viene del norte");
  }else if(state3 == 0){
    direction = 3;
    Serial.println("Viento viene del oeste");
  }else if(state4 == 0){
    direction = 1;
    Serial.println("Viento viene del este");
  }else{
    direction = 0;
    Serial.println("Ningun sensor detectado");
  }
  
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
  data += String(velocity2);
  data += ",";
  // TODO: direccion del viento
  data += String(direction);
  data += ",";
  data += String(pression);
  Serial.println(data);
  delay(3000);
}
