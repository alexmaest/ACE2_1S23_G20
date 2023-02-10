#include <math.h>

#include <Wire.h>             //Incluye libreria de bus I2C
#include <Adafruit_Sensor.h>  //Incluye librerias para sensor BMP280
#include <Adafruit_BMP280.h>

#include <DHT.h>
#include <DHT_U.h>

#define Type DHT11
const float a = 17.625;
const float b = 243.04;
const float e = 2.71828;
const float a1 = -7.85951783;
const float a2 = 1.84408259;
const float a3 = -11.7866497;
const float a4 = 22.6807411;
const float a5 = -15.9618719;
const float a6 = 1.80122502;
const float Pc = 22.064 * 1E6;
const float Tc = 647.096;
const float Rw = 461.5;
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
float Pa;
float Ps;
float tao;
float a_sum;
float tempK;
float abs_humidity;
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
    Serial.begin(9600);
    pinMode(pinNorth, INPUT);
    pinMode(pinSouth, INPUT);
    pinMode(pinEast, INPUT);
    pinMode(pinWest, INPUT);

    if (!bmp.begin()) {
        Serial.print("SensorID was: 0x");
        Serial.println(bmp.sensorID(), 16);
        while (1) { Serial.println("No se ha detectado el BMP280"); }
    }
    HT.begin();
}

void loop() {
    // Sensors Data
    state1 = digitalRead(pinNorth);
    state2 = digitalRead(pinSouth);
    state3 = digitalRead(pinEast);
    state4 = digitalRead(pinWest);

    humidity = HT.readHumidity();
    tempC = HT.readTemperature();
    tempF = HT.readTemperature(true);
    tempC2 = bmp.readTemperature();
    pression = (bmp.readPressure() / 100);

    // Dew Point Calculation
    ln = log(humidity / 100.0) / log(e);
    alpha = ln + ((a * tempC) / (b + tempC));
    dewPoint = (b * alpha) / (a - alpha);

    // Absolute Humidity Calculation
    tempK = 273.15 + tempC;
    tao = 1.0 - (tempK / Tc);
    a_sum = a1 * tao + a2 * pow(tao, 1.5) + a3 * pow(tao, 3.0) + a4 * pow(tao, 3.5) + a5 * pow(tao, 4.0) + a6 * pow(tao, 7.5);
    Ps = Pc * exp(((Tc / tempK) * a_sum));
    Pa = Ps * (humidity / 100.0);
    abs_humidity = Pa / (Rw * tempK);
    abs_humidity = abs_humidity * 1000;

    // Air Velocity Calculation
    velocity1 = analogRead(A0);       // lectura de sensor a0
    velocity2 = (velocity1 * 0.190);  // 0,190 corresponde a la pendiente de la curva aca deben poner el numero que calcularon

    // Wind Direction
    if (state1 == 0) {
        direction = 2;
    } else if (state2 == 0) {
        direction = 0;
    } else if (state3 == 0) {
        direction = 3;
    } else if (state4 == 0) {
        direction = 1;
    } else {
        direction = 0;
    }

    // Format Data
    data = "";
    data += String(tempC);
    data += ",";
    data += String(humidity);
    data += ",";
    data += String(abs_humidity);
    data += ",";
    data += String(dewPoint);
    data += ",";
    data += String(velocity2);
    data += ",";
    data += String(direction);
    data += ",";
    data += String(pression);
    Serial.println(data);
    delay(3000);
}
