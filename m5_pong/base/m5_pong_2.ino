
// WiFiNINA_Generic - Version: Latest
#include <WiFiNINA_Generic.h>
#include <Arduino_LSM6DS3.h>

// Network info
char ssid[] = "ARDUINO_NET";
char pass[] = "ARDUINO_PASS";

int id = 1;

// Wifi locals
int status = WL_IDLE_STATUS;
WiFiServer server(80);

float ax, ay, az, dir;

// What: Create Arduino Wifi AP
// Where: https://www.arduino.cc/en/Guide/MKRWiFi1010/web-server-ap-mode
// Why: This is a tutorial for Wifi AP server setup, so my setup is heavily
// influenced by this setup code
void setup() {

  Serial.begin(9600);
  while (!Serial);


  if (id == 0) {
    // Create Arduino Access point
    while (status != WL_AP_LISTENING) {
      Serial.print("Attempting to create network: ");
      Serial.println(ssid);
      status = WiFi.beginAP(ssid, pass);
      delay(10000);
    }
  }
  else {
    while (status != WL_CONNECTED) {
      Serial.print("Attempting to connect to network: ");
      Serial.println(ssid);
      status = WiFi.beginAP(ssid, pass);
      delay(10000);
    }
  }

  // Print network info after connecting
  Serial.println("Connected to the network");
  Serial.println("---------------------------------------");
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // Start server and IMU
  server.begin();
  IMU.begin();

}


void loop() {
  // Read IMU data
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(ax, ay, az);
  }

  // Check if a client exists
  WiFiClient client = server.available();

  if (az >= 0.5) {
    dir = 10.0;
  }
  else if (az <= -0.5) {
    dir = -10.0;
  }
  else {
    dir = 0.0;
  }

  if (client) {
    Serial.println("New client");

    // Write IMU data to HTTP request to respond to client
    while (client.connected())
    {
      delayMicroseconds(10);
      if (client.available()) {
        client.println("HTTP/1.1 200 OK");
        client.println("Content-type:application/json");
        client.println();
        client.println("{");
        client.print("\"dir\":");
        client.print(dir);
        client.println("}");
        client.println();
        break;
      }
    }

    // Wait for a little after each client
    delay(50);
    client.stop();
  }
}