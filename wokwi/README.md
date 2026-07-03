# Wokwi Representative Circuit

This folder contains a one-room concept simulation for the required hardware/electrical schematic.

It models the Drawing Room with:

- ESP32 controller
- Five low-voltage output channels
- Two fan loads
- Three light loads
- Five low-voltage switch/sense inputs
- Relay/contactor and current-sensing concepts documented in `docs/hardware-schematic.md`

## Pin Mapping

| Device | Output GPIO | Sense GPIO | Rated Watts |
|---|---:|---:|---:|
| Fan 1 | 16 | 32 | 60W |
| Fan 2 | 17 | 33 | 60W |
| Light 1 | 18 | 25 | 15W |
| Light 2 | 19 | 26 | 15W |
| Light 3 | 21 | 27 | 15W |

## How The Simulation Works

- Slide switches represent safe wall-switch or opto-isolated device-state feedback.
- LEDs represent the output state for the two fans and three lights.
- The ESP32 reads each switch with `INPUT_PULLUP`.
- When a switch is ON, the matching output LED turns ON and the serial monitor prints its wattage.
- The serial monitor emits a JSON room snapshot every 2.5 seconds.

## Real Hardware Note

The Wokwi LEDs are safe stand-ins. In real hardware, these ESP32 output pins would drive isolated relay/contactor modules, not AC loads directly. Sense inputs should use opto-isolation or a safe low-voltage wall-switch feedback circuit.
