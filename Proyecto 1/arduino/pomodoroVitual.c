#include <LiquidCrystal.h>
#define PULSADOR 8
#define SENSOR 9

// LiquidCrystal lcd(RS,E,D4,D5,D6,D7);
LiquidCrystal lcd(2, 3, 4, 5, 6, 7);

// pines a utilizar
const int resetButton = 8; // Pin del botón de reset
const int sensor = 9;      // Pin del sensor cuando la persona se sienta

// Variables para contar el tiempo
int workTime = 25;
int restTime = 5;
int segundos = 0;

// Variables para controlar el estado del botón
bool buttonState = HIGH;
bool lastButtonState = HIGH;

// bandera para saber si se ha iniciado el pomodoro
bool pomodoroIniciado = false;

/*************************************************
 ******** FUNCIONES BASICAS DE POMODORO **********
 *************************************************/

// Función para iniciar el pomodoro
void iniciarPomodoro()
{
  // Se muestra el tiempo de trabajo en la pantalla LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("INICIA POMODORO");
  delay(1000);
  while (workTime > 0 || segundos > 0)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Transcurrido: ");
    lcd.setCursor(0, 1);
    lcd.print(String(workTime) + ":" + String(segundos));
    delay(1000);
    if (segundos == 0)
    {
      segundos = 59;
      workTime--;
    }
    else
    {
      segundos--;
    }
    if (workTime == 0 && segundos == 0)
    {
      finalizarPomodoro();
    }
    else if (digitalRead(sensor) == 1)
    {
      workTime = 0;
      segundos = 0;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Usuario se levanto de silla");
      
    }
  }
}
// Función para finalizar el pomodoro
void finalizarPomodoro()
{
  // Se muestra el tiempo de descanso en la pantalla LCD
  lcd.setCursor(0, 0);
  lcd.print(restTime);
  delay(1000);
  restTime--;
  lcd.clear();
}
// Función para restablecer el pomodoro
void resetPomodoro()
{
  while (digitalRead(sensor) == 1)
  {
    // sensorState = digitalRead(sensor);
    animacionPomodoroNoIniciado();
  }
  workTime = 25;
  restTime = 5;
}

/*************************************************
 *********** FUNCIONES DISPLAY LCD  **************
 *************************************************/

void animacionPomodoroNoIniciado()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("25");
  delay(500);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("05");
  delay(500);
}

void setup()
{
  // se configura el pin del botón como entrada y la resistencia pull-up interna
  pinMode(resetButton, INPUT_PULLUP);
  lcd.begin(16, 2);
}

void loop()
{
  // Se comprueba si el pomodoro ha sido iniciado
  if (pomodoroIniciado == false)
  {
    while (digitalRead(sensor) == 1)
    {
      // Se muestra los números 25 y 5 de forma intermitente en la pantalla LCD hasta que la persona se siente
      animacionPomodoroNoIniciado();
    }
    // Se inicia el pomodoro
    iniciarPomodoro();
    pomodoroIniciado = true;
  }

  // se lee el estado del botón
  buttonState = digitalRead(resetButton);
  // Si el botón se ha presionado, se reestablece el pomodoro
  if (buttonState == LOW && lastButtonState == HIGH)
  {
    resetPomodoro();
  }
  // Guardamos el estado del botón para la próxima iteración
  lastButtonState = buttonState;
}