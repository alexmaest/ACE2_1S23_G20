#include <LiquidCrystal.h>
#define BOCINA 8
#define SENSOR 9
#define RESET 10

//FIGURAS PANTALLA
byte Bell[] = {
  B00100,
  B01110,
  B01110,
  B01110,
  B11111,
  B00000,
  B00100,
  B00000
};

byte Lock[8] = {
0b01110,
0b10001,
0b10001,
0b11111,
0b11011,
0b11011,
0b11111,
0b00000
};

byte depie[] = {
  0x04,
  0x15,
  0x0E,
  0x04,
  0x0A,
  0x0A,
  0x0A,
  0x00
};
byte sentado[] = {
  0x08,
  0x08,
  0x08,
  0x08,
  0x0F,
  0x09,
  0x09,
  0x00
};




LiquidCrystal lcd(2, 3, 4, 5, 6, 7); // Determina los pines para la pantalla
int vOut;                          // Almacena el valor del potenciometro
int tdefdimmer=0;
bool dimerActivo = false;

// pines a utilizar
const int bocina = 8; // Bocina
const int sensor = 9; // Pin del sensor cuando la persona se sienta
const int reset = 10; // Boton de reinicio

// Variables de tiempo de trabajo y descanso default
const int tiempoTrabajoDefault = 25; // unidades de 1 minuto
const int tiempoDescansoDefault = 5; // unidades de 1 minuto

// Variables que toma el pomodoro para trabajo y descanso
int tiempoTrabajo = tiempoTrabajoDefault;
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

// PARA ENVIAR DATOS A LA APP
//C=ciclo
//T=tiempo de trabajo
//D=tiempo de descanso
//S=sentado
//N=no sentado
//Ejemplos:
// C0--N = en este caso no se ha iniciado el pomodoro y por ello no se ha configurado el tiempo de trabajo/descanso y la persona no esta sentada
// C1T25D5S = en este caso el pomodoro 1 tiene 25 minutos de trabajo y 5 minutos de descanso y la persona esta sentada

void setup()
{
  Serial.begin(115200);
  lcd.begin(16, 2);
  lcd.clear();
  // se configura el pin del botón como entrada y la resistencia pull-up interna
  pinMode(reset, INPUT_PULLUP);
  lcd.createChar(0, depie);
  lcd.createChar(1,sentado);
  lcd.createChar(2,Lock);
  lcd.createChar(3,Bell);
}

void loop()
{
  if (pomodoroIniciado == false)
  {
    vOut = analogRead(A0);
    tdefdimmer = map(vOut, 50, 1000, 1, 45);
    while (digitalRead(sensor) == 1) // persona no esta sentada
    {
      // Se muestra los números 25 y 5 de forma intermitente en la pantalla LCD hasta que la persona se siente
      //Serial.println("N");
      //Serial.println("C0--N");
      noIniciado();
    }
    // Se inicia el pomodoro cuando la persona se sienta
    //Serial.println("S");
    //Serial.println("C0--S");
    pomodoroIniciado = true;
    // en dado caso se encienda el pomodoro y la persona ya esta sentada
    if (tiempoTrabajo == 0)
    {
      // como el tiempo aun no se configuro
      // lee el potenciometro para
      // posterior inciar el pomodoro
      noIniciado();
    }
    enviarTiempoPomodoro();
    iniciaPomodoro();
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
  int tiempodepie = 0;//para registrar los segundos que la persona se levanta de la silla
  int minutoselevanto = 0;//para guardar el minuto en que se levanto
  int segundoselevanto = 0;
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
      if (tiempodepie == 0)
      {
        minutoselevanto = tiempoTrabajo;
        segundoselevanto = (segundos!=59) ? (segundos+1) : segundos;
      }
      tiempodepie++;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.write(byte(0));
      lcd.print(" Se levanto");
      //Serial.println("N");
      //mandar minutos y segundos restantes
      //Serial.println("C" + String(noPomodoro) + "T" + String(tiempoTrabajo) + ":" + String(segundos) + "S");
      delayMillis(300);
    }
    else
    {
      //Serial.println("S");
      if (tiempodepie > 0)
      {
        Serial.println(String(minutoselevanto) + "$" + String(segundoselevanto) + "$"+ String(noPomodoro)+"$T$"+String(tiempodepie));
        tiempodepie = 0;
        minutoselevanto = 0;
        segundoselevanto = 0;
      }
      //Serial.println("C" + String(noPomodoro) + "T" + String(tiempoTrabajo) + ":" + String(segundos) + "S");
    }
    if (tiempoTrabajo == 0 && segundos == 10)
    {
      buzzer10Segundos();
    }
    if (digitalRead(reset) == LOW)
    {
      resetInesperado();
      break;
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
  tiempoTrabajo = (dimerActivo == true) ? tiempoTrabajoDimmer : tiempoTrabajoDefault;
  segundos = 0;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.write(byte(3));
  buzzerFinPomodoro();
  if (digitalRead(reset) == LOW)
  {
    resetInesperado();
  }else{
    iniciarDescanso();
  }
}

void iniciarDescanso()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Inicia Descanso");
  lcd.setCursor(0, 1);
  lcd.print(String(noPomodoro));
  int tiemposentado = 0;//para registrar los segundos que la persona se sento en la silla
  int minutoenqsento = 0;//para guardar el minuto en que se sento
  int segundoenqsento = 0;
  delayMillis(2000);
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
      if (tiemposentado == 0)
      {
        minutoenqsento = tiempoDescanso;
        segundoenqsento = (segundos!=59) ? (segundos+1) : segundos;
      }
      tiemposentado++;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.write(byte(1));
      lcd.print(" Se sento");
      //Serial.println("S");
      //Serial.println("C" + String(noPomodoro) + "D" + String(tiempoDescanso) + ":" + String(segundos) + "S");
      delayMillis(300);
    }
    else
    {
      if (tiemposentado > 0)
      {
        Serial.println(String(minutoenqsento) + "$" + String(segundoenqsento) + "$"+ String(noPomodoro)+"$D$"+String(tiemposentado));
        tiemposentado = 0;
        minutoenqsento = 0;
        segundoenqsento = 0;
      }
      //Serial.println("N");
      //Serial.println("C" + String(noPomodoro) + "D" + String(tiempoDescanso) + ":" + String(segundos) + "N");
    }
    if (tiempoDescanso == 0 && segundos == 10)
    {
      buzzer10Segundos();
    }
    if (digitalRead(reset) == LOW)
    {
      resetInesperado();
      break;
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
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.write(byte(3));
  buzzerFinDescanso();
  noPomodoro++;
  if (noPomodoro > 4) //(noPomodoro > 1)
  {
    resetPomodoro();
  }
  else if(digitalRead(reset) == LOW){
    resetInesperado();
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
    animacioCicloPomodoroFinalizado();
    estadoBotonReset = digitalRead(reset);
  }
  // lastestadoBotonReset = LOW;
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fin Pomodoro");
  lcd.setCursor(0, 1);
  lcd.print("Reset");
  delayMillis(1000);
  dimerActivo = false;
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
  tiempoTrabajoDimmer = map(valorPotenciometro, 50, 1000, 1, 45);
  if (tiempoTrabajoDimmer != tdefdimmer || dimerActivo == true){
    dimerActivo = true;
    tiempoTrabajo = tiempoTrabajoDimmer;
  }
}

void resetInesperado()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(" -- RESET -- ");
  delayMillis(1000);
  dimerActivo = false;
  tiempoTrabajo = tiempoTrabajoDefault;
  tiempoDescanso = tiempoDescansoDefault;
  tiempoTrabajoApp = 0;
  tiempoDescansoApp = 0;
  tiempoTrabajoDimmer = 0;
  segundos = 0;
  noPomodoro = 1;
  pomodoroIniciado = false;
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
    if (c == 'D')
    {
      int aux = 0; // variable auxiliar para construir el número
      tiempoDescansoApp = 0;
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
  if (tiempoDescansoApp != 0)
  {
    tiempoDescanso = tiempoDescansoApp;
  }
  duracionPomodoro();
}

void enviarTiempoPomodoro(){
  Serial.println(String(tiempoTrabajo)+"$"+String(tiempoDescanso));
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

void animacioCicloPomodoroFinalizado()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.write(byte(2));
  lcd.print(" Ciclo Finalizado");
  lcd.setCursor(0, 1);
  // mensaje pulse reset
  lcd.print("Pulse reset");
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
  int notas[] = {659, 659, 0, 659, 0, 494, 659, 0, 784};          // Definir frecuencias de notas
  int duracion[] = {200, 200, 200, 200, 200, 200, 200, 200, 400}; // Duración en milisegundos de cada nota
  for (int i = 0; i < 9; i++)
  {
    tone(BOCINA, notas[i], duracion[i]);
    delayMillis(duracion[i] * 1.3);
  }
}

// finaliza descanso
void buzzerFinDescanso()
{
  int notas[] = {261, 294, 329, 349, 392, 440, 494};    // Definir frecuencias de notas
  int duracion[] = {100, 100, 200, 200, 100, 100, 300}; // Duración en milisegundos de cada nota
  for (int i = 0; i < 7; i++)
  {
    tone(BOCINA, notas[i], duracion[i]);
    delayMillis(duracion[i] * 1.2);
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