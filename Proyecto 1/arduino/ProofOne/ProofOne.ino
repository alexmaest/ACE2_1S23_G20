#include <LiquidCrystal.h>
#define BOCINA 8
#define SENSOR 9
#define RESET 10

LiquidCrystal lcd(2, 3, 4, 5, 6, 7); // Determina los pines para la pantalla
float vOut;                          // Almacena el valor del potenciometro

// pines a utilizar
const int bocina = 8; // Bocina
const int sensor = 9; // Pin del sensor cuando la persona se sienta
const int reset = 10; // Boton de reinicio

// Variables de tiempo de trabajo y descanso default
const int tiempoTrabajoDefault = 25; // unidades de 1 minuto
const int tiempoDescansoDefault = 5; // unidades de 1 minuto

// Variables que toma el pomodoro para trabajo y descanso
int tiempoTrabajo = 0;
int tiempoDescanso = tiempoDescansoDefault;

// Variables para contar el tiempo
int tiempoTrabajoDimmer = 0; // unidades de 1 minuto
int segundos = 0;
int noPomodoro = 1;

// variables que almacenan valor de tiempo de trabajo y descanso que se envian desde la app
int tiempoTrabajoApp = 0;
int tiempoDescansoApp = 0;

// Variables para controlar el estado del botón
bool estadoBotonReset = HIGH;
bool lastestadoBotonReset = HIGH;

// bandera para saber si se ha iniciado el pomodoro
bool pomodoroIniciado = false;

void setup()
{
  Serial.begin(115200);
  lcd.begin(16, 2);
  lcd.clear();
  // se configura el pin del botón como entrada y la resistencia pull-up interna
  pinMode(reset, INPUT_PULLUP);
}

void loop()
{
  if (pomodoroIniciado == false)
  {
    while (digitalRead(sensor) == 1) // persona no esta sentada
    {
      // Se muestra los números 25 y 5 de forma intermitente en la pantalla LCD hasta que la persona se siente
      Serial.println("N");
      noIniciado();
    }
    // Se inicia el pomodoro cuando la persona se sienta
    Serial.println("S");
    pomodoroIniciado = true;
    iniciaPomodoro();
  }
  if (digitalRead(sensor) == 1)
  {
    Serial.println("N");
  }
  else
  {
    Serial.println("S");
  }
}

/*************************************************
 ******** FUNCIONES BASICAS DE POMODORO **********
 *************************************************/

// Función para iniciar el pomodoro
void iniciaPomodoro()
{
  // Se muestra el tiempo de trabajo en la pantalla LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("INICIA POMODORO:");
  lcd.setCursor(0, 1);
  lcd.print(String(noPomodoro));
  delayMillis(2000);
  while (tiempoTrabajo > 0 || segundos > 0)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Transcurrido: ");
    lcd.setCursor(0, 1);
    lcd.print(String(tiempoTrabajo) + ":" + String(segundos));
    delayMillis(1000);
    if (segundos == 0)
    {
      segundos = 59;
      tiempoTrabajo--;
    }
    else
    {
      segundos--;
    }
    if (digitalRead(sensor) == 1) // si usuario se levanta de silla
    {
      // penalizaciones
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Se levanto");
      Serial.println("N");
      delayMillis(500);
    }
    else
    {
      Serial.println("S");
    }
    if (tiempoTrabajo == 0 && segundos == 10)
    {
      buzzer10Segundos();
    }
  }
  if (tiempoTrabajo == 0 && segundos == 0)
  {
    finalizarPomodoro();
  }
}

// Función para finalizar el pomodoro
void finalizarPomodoro()
{
  tiempoTrabajo = (tiempoTrabajoApp != 0) ? tiempoTrabajoApp : ((tiempoTrabajoDimmer != 0) ? tiempoTrabajoDimmer : tiempoTrabajoDefault);
  segundos = 0;
  buzzerFinPomodoro();
  iniciarDescanso();
}

void iniciarDescanso()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Inicia Descanso");
  delayMillis(1000);
  while (tiempoDescanso > 0 || segundos > 0)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Descanso: ");
    lcd.setCursor(0, 1);
    lcd.print(String(tiempoDescanso) + ":" + String(segundos));
    delayMillis(1000);
    if (segundos == 0)
    {
      segundos = 59;
      tiempoDescanso--;
    }
    else
    {
      segundos--;
    }
    if (digitalRead(sensor) == 0) // si usuario se sienta en silla
    {
      // penalizaciones
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Se sento");
      Serial.println("S");
      delayMillis(500);
    }
    else
    {
      Serial.println("N");
    }
    if (tiempoDescanso == 0 && segundos == 10)
    {
      buzzer10Segundos();
    }
  }
  if (tiempoDescanso == 0 && segundos == 0)
  {
    finalizarDescanso();
  }
}

void finalizarDescanso()
{
  tiempoDescanso = (tiempoDescansoApp != 0) ? tiempoDescansoApp : tiempoDescansoDefault;
  segundos = 0;
  buzzerFinDescanso();
  noPomodoro++;
  if(noPomodoro > 4) //(noPomodoro > 1)
  {
    resetPomodoro();
  }
  else
  {
    iniciaPomodoro();
  }
}

// Función para restablecer el pomodoro
void resetPomodoro()
{
  // se lee el estado del botón
  estadoBotonReset = digitalRead(reset);
  while (estadoBotonReset != LOW)
  {
    animacionPomodoroNoIniciado();
    estadoBotonReset = digitalRead(reset);
  }
  // lastestadoBotonReset = LOW;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pomodoro");
  lcd.setCursor(0, 1);
  lcd.print("Reset");
  delayMillis(1000);
  tiempoTrabajo = tiempoTrabajoDefault;
  tiempoDescanso = tiempoDescansoDefault;
  tiempoTrabajoApp = 0;
  tiempoDescansoApp = 0;
  tiempoTrabajoDimmer = 0;
  segundos = 0;
  noPomodoro = 1;
  pomodoroIniciado = false;
}

// se lee analog pin A0, esta el potenciometro
void duracionPomodoro()
{
  int valorPotenciometro = analogRead(A0);
  tiempoTrabajoDimmer = map(valorPotenciometro, 0, 1039, 1, 45);
  tiempoTrabajo = tiempoTrabajoDimmer;
}

// metodo que lee la entrada serial
// la cadena que se debe enviar desde el frontend es asi:
// TtiempoTrabajoDtiempoDescanso;
// ejemplo: T25D5;
void leeApp()
{
  while (Serial.available() > 0)
  {
    delayMillis(300);
    char c = Serial.read();
    if (c == 'T')
    {
      int aux = 0; // variable auxiliar para construir el número
      tiempoTrabajoApp = 0;
      tiempoDescansoApp = 0;
      // recorrer para ir guardando el tiempo de trabajo hasta que encuentre 'D'
      while (c != 'D')
      {
        c = Serial.read();
        if (isdigit(c))
        {
          aux = aux * 10 + (c - '0'); // construir el número con cada dígito
        }
      }
      tiempoTrabajoApp = aux; // sumar el número completo a la variable
      aux = 0;
      // recorrer para ir guardando el tiempo de descanso hasta que encuentre ';'
      while (c != ';')
      {
        c = Serial.read();
        // guardar el tiempo de descanso parse a int e ir sumando
        if (isdigit(c))
        {
          aux = aux * 10 + (c - '0'); // construir el número con cada dígito
        }
      }
      tiempoDescansoApp = aux; // sumar el número completo a la variable
    }
  }
}

void noIniciado()
{
  animacionPomodoroNoIniciado();
  leeApp(); // duda si se lee desde el app, entonces el dimmer ya no debe funcionar
  if (tiempoTrabajoApp != 0 && tiempoDescansoApp != 0)
  {
    tiempoTrabajo = tiempoTrabajoApp;
    tiempoDescanso = tiempoDescansoApp;
  }
  else
  {
    duracionPomodoro();
  }
}

/*************************************************
 *********** FUNCIONES DISPLAY LCD  **************
 *************************************************/

void animacionPomodoroNoIniciado()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Trabajo: " + String(tiempoTrabajo) + ":00");
  lcd.setCursor(0, 1);
  lcd.print("Descanzo: " + String(tiempoDescanso) + ":00");
  delayMillis(500);
  lcd.clear();
  delayMillis(500);
}

void delayMillis(int tiempo)
{
  unsigned long tiempoActualEspera = millis();
  while (millis() - tiempoActualEspera < tiempo)
  {
    // solo espera
  }
}

/*************************************************
 *********** FUNCIONES DE SPEAKER  ***************
 *************************************************/

// finaliza pomodoro
void buzzerFinPomodoro()
{
  for (int i = 0; i < 2; i++)
  {
    for (int j = 0; j < 3; j++)
    {
      tone(BOCINA, 1000, 150);
      delayMillis(200);
    }
    delayMillis(400);
  }
}

// finaliza descanso
void buzzerFinDescanso()
{
  for (int i = 0; i < 2; i++)
  {
    for (int j = 0; j < 3; j++)
    {
      tone(BOCINA, 2000, 150);
      delayMillis(200);
    }
    delayMillis(400);
  }
}

// aviso que restan 10 segundos
void buzzer10Segundos()
{
  for (int i = 0; i < 2; i++)
  {
    tone(BOCINA, 1000, 100);
    delayMillis(200);
  }
}