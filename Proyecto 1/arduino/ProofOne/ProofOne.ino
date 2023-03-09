#include <LiquidCrystal.h>
#define BOCINA 8
#define SENSOR 9
#define RESET 10

LiquidCrystal lcd(2, 3, 4, 5, 6, 7);//Determina los pines para la pantalla
float vOut;//Almacena el valor del potenciometro

// pines a utilizar
const int bocina = 8;     // Bocina
const int sensor = 9;      // Pin del sensor cuando la persona se sienta
const int resetButton = 10; // Boton de reinicio


// Variables para contar el tiempo
int tiempoTrabajo = 25; // unidades de 1 minuto
int tiempoDescanso = 1; // unidades de 1 minuto
int segundos = 0;
int noPomodoro = 1;

// variables que almacenan valor de tiempo de trabajo y descanso que se envian desde la app
int tiempoTrabajoApp = 1;
int tiempoDescansoApp = 1;

// Variables para controlar el estado del botón
bool estadoBotonReset = HIGH;
bool lastestadoBotonReset = HIGH;

// bandera para saber si se ha iniciado el pomodoro
bool pomodoroIniciado = false;




void setup() {
  Serial.begin(115200);
  lcd.begin(16, 2);
  lcd.clear();
  // se configura el pin del botón como entrada y la resistencia pull-up interna
  pinMode(resetButton, INPUT_PULLUP);
}

void loop() {
  // Se comprueba si el pomodoro ha sido iniciado
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
    iniciaPomodoro();
    pomodoroIniciado = true;
  }

  // se lee el estado del botón
  estadoBotonReset = digitalRead(resetButton);
  // Si el botón se ha presionado, se reestablece el pomodoro
  if (estadoBotonReset == LOW && lastestadoBotonReset == HIGH)
  {
    resetPomodoro();
  }
  // Guardamos el estado del botón para la próxima iteración
  lastestadoBotonReset = estadoBotonReset;
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
  lcd.print("INICIA POMODORO: " + String(noPomodoro));
  delayMillis(1000);
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
      delayMillis(1000);
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
  tiempoTrabajo = tiempoTrabajoApp;
  segundos = 0;
  tone(BOCINA, 1000, 1000);
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
      delayMillis(1000);
    }
  }
  if (tiempoDescanso == 0 && segundos == 0)
  {
    finalizarDescanso();
  }
}

void finalizarDescanso()
{
  tiempoDescanso = tiempoDescansoApp;
  segundos = 0;
  tone(BOCINA, 2000, 1000);
  noPomodoro++;
  if (noPomodoro > 4)
  {
    pomodoroIniciado = false;
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
  while (digitalRead(sensor) == 1)
  {
    // sensorState = digitalRead(sensor);
    animacionPomodoroNoIniciado();
  }
  tiempoTrabajo = 25;
  tiempoDescanso = 5;
  segundos = 0;
  noPomodoro = 1;
}

// se lee analog pin A0, esta el potenciometro
void duracionPomodoro()
{
  int valorPotenciometro = analogRead(A0);
  tiempoTrabajo = map(valorPotenciometro, 1, 1039, 1, 45);
}

void noIniciado()
{
  animacionPomodoroNoIniciado();
  duracionPomodoro();
}

/*************************************************
 *********** FUNCIONES DISPLAY LCD  **************
 *************************************************/

void animacionPomodoroNoIniciado()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(String(tiempoTrabajo));
  delayMillis(500);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(String(tiempoDescanso));
  delayMillis(500);
}

void delayMillis(int tiempo)
{
  unsigned long tiempoActualEspera = millis();
  while (millis() - tiempoActualEspera < tiempo)
  {
    //solo espera
  }
}