#include <DHT.h>
#include <DHT_U.h>

#define Type DHT11
#define echo 5
#define trigger 6

DHT HT(3, Type);
DHT HT2(4, Type);
float tempC;// Temperatura interna del invernadero
float tempC2;// Temperatura externa del invernadero
long duracion, distancia;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(2,OUTPUT);
  pinMode(3,INPUT);
  pinMode(4,INPUT);
  pinMode(echo,INPUT);
  pinMode(trigger,OUTPUT);
  HT.begin();
  HT2.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(trigger, LOW);//Instrucciones que generan el sonido para medir
  delayMicroseconds(2);
  digitalWrite(trigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger, LOW);

  duracion = pulseIn(echo, HIGH);
  distancia = (duracion / 2) / 29;
  Serial.print(distancia);//Distancia del sensor ultrasonico
  Serial.println("cm");

  int lectura = analogRead(A0);
  int lecturaPorcentaje = map(lectura, 1023, 0, 0, 100);
  Serial.print(lecturaPorcentaje);// Porcentaje de humedad en la tierra
  Serial.println("%");
  
  tempC = HT.readTemperature();
  tempC2 = HT2.readTemperature();
  Serial.println(tempC);// Temperatura interna del invernadero
  Serial.println(tempC2);// Temperatura externa del invernadero
  Serial.println("-------------------");
  digitalWrite(2,HIGH);// Apaga la bomba de agua
  delay(1000);
  digitalWrite(2,LOW);// Prende la bomba de agua
  delay(1000);
}
