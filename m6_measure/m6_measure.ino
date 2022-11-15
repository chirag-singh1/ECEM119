int analogPin = A3; // potentiometer wiper (middle terminal) connected to analog pin 3
                    // outside leads to ground and +5V
int val[300];  // variable to store the value read
long avg = 0;
int ind = 0;

void setup() {
  Serial.begin(9600);           //  setup serial
}

void loop() {
  int newInd = (ind + 1) % 300;
  avg -= val[newInd];
  val[newInd] = analogRead(analogPin);
  avg += val[newInd];
  ind = newInd;
  Serial.println(avg / 300);          // debug value

}