# Hardware Schematic Plan

The preliminary round does not require real hardware. A representative circuit for one room is enough, but it must make physical sense.

## Representative Room

Use one room with:

- 2 fans
- 3 lights
- 1 microcontroller
- Optional current sensing
- Safe switching or state sensing concept

## Recommended Controller

Use an ESP32 in Wokwi or Tinkercad because it maps well to IoT systems and Wi-Fi-based telemetry.

## Conceptual Design

For a safe demo schematic, model each light/fan as a low-voltage representative load instead of actual AC mains.

Possible options:

- Use LEDs to represent lights.
- Use small DC motors to represent fans.
- Use switches or digital inputs to represent whether a real device is on.
- Use relay modules conceptually if showing how actual loads would be controlled.
- Use a current sensor conceptually for power draw estimation.

## Pin Mapping Example

| Device | Type | ESP32 Pin | Direction | Notes |
| --- | --- | --- | --- | --- |
| Light 1 state | Light | GPIO 18 | Input | Reads simulated switch/state |
| Light 2 state | Light | GPIO 19 | Input | Reads simulated switch/state |
| Light 3 state | Light | GPIO 21 | Input | Reads simulated switch/state |
| Fan 1 state | Fan | GPIO 22 | Input | Reads simulated switch/state |
| Fan 2 state | Fan | GPIO 23 | Input | Reads simulated switch/state |
| Current sensor | Sensor | GPIO 34 | Analog input | Optional aggregate current reading |

## Connection List

- Connect each switch output to one ESP32 digital input pin.
- Use pull-down or pull-up resistors so inputs do not float.
- Connect all grounds together.
- If using LEDs for lights, place a current-limiting resistor in series with each LED.
- If using DC motors for fans, drive them through a transistor or motor driver, not directly from GPIO.
- If showing relays, keep the relay coil side isolated from the represented load side.

## Electrical Reasoning

GPIO pins should only sense or control low-current signals. Motors, relays, and real AC appliances should never be powered directly from a microcontroller pin. A practical real-world version would use isolated sensing or relay modules, proper protection, and qualified electrical review for mains wiring.

## Deliverable

Create the schematic manually in Wokwi or Tinkercad, export a screenshot, and save it under:

```text
docs/assets/hardware-schematic.png
```

Do not include a generated Wokwi/Tinkercad project file unless explicitly required by organizers.
