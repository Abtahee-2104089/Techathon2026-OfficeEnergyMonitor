struct DevicePin {
  const char* id;
  const char* room;
  const char* type;
  const char* name;
  uint8_t outputPin;
  uint8_t sensePin;
  uint16_t ratedWatts;
};

DevicePin devices[] = {
  { "drawing-room-fan-1", "drawing-room", "fan", "Fan 1", 16, 32, 60 },
  { "drawing-room-fan-2", "drawing-room", "fan", "Fan 2", 17, 33, 60 },
  { "drawing-room-light-1", "drawing-room", "light", "Light 1", 18, 25, 15 },
  { "drawing-room-light-2", "drawing-room", "light", "Light 2", 19, 26, 15 },
  { "drawing-room-light-3", "drawing-room", "light", "Light 3", 21, 27, 15 },
};

void setup() {
  Serial.begin(115200);

  for (DevicePin device : devices) {
    pinMode(device.outputPin, OUTPUT);
    pinMode(device.sensePin, INPUT_PULLUP);
    digitalWrite(device.outputPin, LOW);
  }
}

void loop() {
  uint16_t totalWatts = 0;
  uint8_t activeDevices = 0;

  Serial.println("{");
  Serial.println("  \"roomId\":\"drawing-room\",");
  Serial.println("  \"roomName\":\"Drawing Room\",");
  Serial.println("  \"devices\":[");

  for (size_t i = 0; i < sizeof(devices) / sizeof(devices[0]); i++) {
    DevicePin device = devices[i];
    bool isOn = digitalRead(device.sensePin) == LOW;
    digitalWrite(device.outputPin, isOn ? HIGH : LOW);

    uint16_t watts = isOn ? device.ratedWatts : 0;
    totalWatts += watts;
    activeDevices += isOn ? 1 : 0;

    Serial.print("  {\"id\":\"");
    Serial.print(device.id);
    Serial.print("\",\"name\":\"");
    Serial.print(device.name);
    Serial.print("\",\"type\":\"");
    Serial.print(device.type);
    Serial.print("\",\"status\":\"");
    Serial.print(isOn ? "on" : "off");
    Serial.print("\",\"watts\":");
    Serial.print(watts);
    Serial.print(",\"ratedWatts\":");
    Serial.print(device.ratedWatts);
    Serial.print("}");
    Serial.println(i == 4 ? "" : ",");
  }

  Serial.println("  ],");
  Serial.print("  \"activeDevices\":");
  Serial.print(activeDevices);
  Serial.println(",");
  Serial.print("  \"totalWatts\":");
  Serial.print(totalWatts);
  Serial.println();
  Serial.println("}");
  delay(2500);
}
