#include <DHT.h>
#include <DHT_U.h>

#define Type DHT11
#define echo 5
#define trigger 6 // Instrucciones que generan el sonido para medir

DHT HT(4, Type);
DHT HT2(3, Type);
float tempC;  // Temperatura interna del invernadero
float tempC2; // Temperatura externa del invernadero
long duracion, distancia;
int tiempoEncendidodeBomba = 0;
int porcentaje = 0;   // Porcentaje de agua en el tanque
int lecturaPorcentaje; // Lectura de la humedad de la tierra

const int alturaTotal = 25; // altura total del tanque en cm

unsigned long ultimoEnvio = 0; // Variable para almacenar el tiempo del último envío de datos
void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  pinMode(echo, INPUT);
  pinMode(trigger, OUTPUT);
  HT.begin();
  HT2.begin();
  digitalWrite(2, HIGH);
}

void loop()
{
  leeApp();
  if (tiempoEncendidodeBomba > 0)
  {
    establecerTiempodeRiego(tiempoEncendidodeBomba);
    //se reestablece el tiempo de encendido de la bomba a 0
    tiempoEncendidodeBomba = 0;
  }
  else
  {
    unsigned long tiempoActual = millis(); // Obtener el tiempo actual
    if (tiempoActual - ultimoEnvio >= 4000)
    {
      enviarInformacioApp();
      ultimoEnvio = tiempoActual;
    }
  }
}

// metodo que lee la entrada serial
// la cadena que se debe enviar desde el frontend la propongo asi:
// EtiempoEncendidodeBomba;
// ejemplo: E20; -> enciende la bomba por 20 segundos
// ejemplo: E; -> no hace nada
void leeApp()
{
  while (Serial.available() > 0)
  {
    delayMillis(300);
    char c = Serial.read();
    if (c == 'E')
    {
      int aux = 0;
      tiempoEncendidodeBomba = 0;
      while (c != ';')
      {
        c = Serial.read();
        // Si el carácter no es un dígito, la entrada es inválida
        if (!isdigit(c) && c != ';')
        {
          // Serial.println("Entrada serial inválida. Ignorando...");
          return;
        }
        if (isdigit(c))
        {
          aux = aux * 10 + (c - '0');
        }
      }
      tiempoEncendidodeBomba = aux;
    }
  }
}

void encenderBombaAgua()
{
  // Encender la bomba de agua
  digitalWrite(2, LOW);
  // Esperar 1 segundo
  delayMillis(100);
}

void apagarBombaAgua()
{
  // Apagar la bomba de agua
  digitalWrite(2, HIGH);
  // Esperar 1 segundo
  delayMillis(100);
}

void establecerTiempodeRiego(int tiempo)
{
  int tiemporegado = 0;
  encenderBombaAgua();
  while (tiemporegado < tiempo)
  {
    delayMillis(1000);
    // Llamar a la función "apagadoEnCualquierMomento()" si se necesita apagar la bomba antes del tiempo de riego completo
    if (apagadoEnCualquierMomento())
    {
      apagarBombaAgua();
      return;
    }
    tiemporegado++;
    // Llamar a la función "enviarInformacioApp()" cada 2 segundos
    if (tiemporegado % 2 == 0)
    {
      enviarInformacioApp();
    }
  }
  apagarBombaAgua();
}

void alertaHumedadTierra()
{
  // Medir la humedad de la tierra
  int lectura = analogRead(A0);
  // Convertir la lectura a porcentaje
  lecturaPorcentaje = map(lectura, 1023, 0, 0, 100);
  // se enviara la cadena h+lecturaPorcentaje+; para indicar que la humedad es de x%
  // ejemplo: h50; -> la humedad es de 50%
  // Serial.println("h"+lecturaPorcentaje+";");
  // Si la humedad es mayor o igual a 80%
  if (lecturaPorcentaje >= 80)
  {
    // se envia cadena w; indicando que la huemda es de 80% o mas
    Serial.println("w;");
  }
}

// Metodo que se encarga de apagar la bomba de agua en cualquier momento
// se debe de leer el serial y si se recibe la letra 'A' se apaga la bomba de agua
// ejemplo: A; -> apaga la bomba de agua
bool apagadoEnCualquierMomento()
{
  // aca se debe de leer el serial y si se recibe la letra 'A' se apaga la bomba de agua
  while (Serial.available() > 0)
  {
    delayMillis(200);
    char c = Serial.read();
    if (c == 'A')
    {
      c = Serial.read();
      if (c == ';')
      {
        return true;
      }
    }
  }
  return false;
}

void nivelDeAguaEnTanque()
{
  // Medir el nivel de agua en el tanque
  digitalWrite(trigger, LOW);
  delayMicroseconds(2);
  digitalWrite(trigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger, LOW);
  duracion = pulseIn(echo, HIGH);
  distancia = (duracion / 2) / 29;

  // Calcular el porcentaje de agua en el tanque
  porcentaje = (alturaTotal - distancia) * 100 / alturaTotal;
  if (porcentaje < 0)
  {
    porcentaje = 0;
  }
  else if (porcentaje > 100)
  {
    porcentaje = 100;
  }
}

void temperaturaInterna()
{
  // Medir la temperatura interna
  tempC = HT.readTemperature();
  // Enviar la temperatura interna por la comunicación serial
  // Serial.println("ti" + String(tempC) + ";");
}

void temperaturaExterna()
{
  // Medir la temperatura externa
  tempC2 = HT2.readTemperature();
  // Enviar la temperatura externa por la comunicación serial
  // Serial.println("te" + String(tempC2) + ";");
}

void enviarInformacioApp()
{
  alertaHumedadTierra(); // aca se esta enviando la hueedad de la tierra
  nivelDeAguaEnTanque(); // aca se esta enviando el nivel de agua en el tanque
  temperaturaInterna();  // aca se esta enviando la temperatura interna
  temperaturaExterna();  // aca se esta enviando la temperatura externa
  String cadena = "";
  cadena = "h$" + String(lecturaPorcentaje) + "$*$";   // cadena de humedad
  cadena = cadena + "p$" + String(porcentaje) + "$*$"; // cadena de porcentaje
  cadena = cadena + "ti$" + String(tempC) + "$*$";     // cadena de temperatura interna
  cadena = cadena + "te$" + String(tempC2) + "$*$;";   // cadena de temperatura externa
  Serial.println(cadena);
  delayMillis(400);
  // h$[valor de lecturaPorcentaje]$*$p$[valor de porcentaje]$*$ti$[valor de tempC]$*$te$[valor de tempC2]$*$
  // ejemplo: h$50$*$p$50$*$ti$30$*$te$40$*$;
}

void delayMillis(int tiempo)
{
  unsigned long tiempoActualEspera = millis();
  while (millis() - tiempoActualEspera < tiempo)
  {
    // solo espera
  }
}