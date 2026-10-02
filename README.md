# AeroBalance

### PA-28-161 Warrior II Weight & Balance Analysis Tool

## Live Demo

**[Launch AeroBalance](https://pipecaspal.github.io/AeroBalance/)**

AeroBalance is an interactive aircraft weight-and-balance application developed for the Piper PA-28-161 Warrior II.

The project calculates aircraft loading conditions during ramp, takeoff, and landing, evaluates center-of-gravity limits, models CG movement caused by fuel consumption, and visualizes the aircraft's loading condition within the allowable CG envelope.

This project was developed as an educational engineering and aviation portfolio project.

> **Educational demonstration only. Not approved for flight planning. Always use the current POH/AFM and aircraft-specific weight-and-balance records for operational calculations.**

---

## Features

- Ramp weight and center-of-gravity calculation
- Takeoff weight and CG calculation
- Landing weight and CG calculation
- Fuel-burn CG analysis
- Weight-dependent forward CG limit interpolation
- Aft CG limit checking
- Maximum ramp and takeoff weight checking
- Fuel capacity validation
- Baggage limit validation
- Payload calculations
- Useful-load calculations
- Remaining takeoff weight margin
- Full-fuel payload calculation
- Interactive CG envelope visualization
- Ramp → Takeoff → Landing CG trajectory
- Automated engineering validation suite

---

## Engineering Principles

AeroBalance uses the standard aircraft weight-and-balance relationships.

### Moment

\[
M = W \times A
\]

where:

- `M` = moment
- `W` = weight
- `A` = arm measured from the aircraft datum

### Center of Gravity

\[
CG = \frac{\sum M}{\sum W}
\]

Each aircraft loading station contributes a weight and corresponding moment. The moments are summed and divided by total aircraft weight to determine the loaded center of gravity.

---

## Loading Stations

The calculator models the primary PA-28-161 loading stations:

- Basic empty aircraft
- Front occupants
- Rear occupants
- Fuel
- Baggage

The application then calculates the total aircraft weight, total moment, and longitudinal center of gravity.

---

## Flight Conditions

AeroBalance evaluates three loading states.

### Ramp

Represents the aircraft before engine start, taxi, and run-up fuel consumption.

### Takeoff

The calculator subtracts the modeled start/taxi/run-up fuel allowance and recalculates:

- weight
- moment
- CG
- forward CG limit
- aft CG limit

### Landing

The user specifies expected trip fuel burn.

AeroBalance subtracts the corresponding fuel weight and moment from the takeoff condition and recalculates the expected landing weight and CG.

This allows the application to visualize CG migration throughout the flight.

---

## CG Envelope

The application plots aircraft weight against longitudinal center of gravity.

The graph displays:

- allowable CG region
- ramp condition
- takeoff condition
- landing condition
- fuel-burn trajectory

The forward CG boundary varies with aircraft weight and is calculated through linear interpolation between published boundary points.

---

## Example

For a demonstration loading condition:

- Basic Empty Weight: `1500 lb`
- Basic Empty CG: `85.9 in`
- Pilot: `170 lb`
- Front Passenger: `170 lb`
- Rear Passengers: `0 lb`
- Fuel: `30 gal`
- Baggage: `20 lb`
- Trip Fuel: `15 gal`

AeroBalance calculates approximately:

| Condition | Weight | CG |
|---|---:|---:|
| Ramp | 2040.0 lb | 86.36 in |
| Takeoff | 2033.0 lb | 86.33 in |
| Landing | 1943.0 lb | 85.93 in |

The movement of the CG during the flight is caused by fuel being removed from the aircraft's fuel station.

---

## Validation

AeroBalance includes an automated engineering validation suite.

Current result:

**9 / 9 tests passed**

The test suite includes:

1. Published Piper POH sample loading case
2. Normal training-flight loading
3. Overweight detection
4. Forward-CG detection
5. Aft-CG detection
6. Fuel-capacity detection
7. Baggage-limit detection
8. Trip-fuel availability detection
9. Forward-CG boundary interpolation

The primary calculation engine reproduces the published Piper sample loading values used during development.

---

## Technologies

AeroBalance was built using:

- HTML5
- CSS3
- JavaScript
- SVG
- Git
- GitHub

No external calculation or charting libraries are required.

The CG envelope and aircraft trajectory are generated directly with SVG and JavaScript.

---

## Project Structure

```text
AeroBalance/
├── index.html
├── styles.css
├── app.js
├── tests.html
├── tests.js
├── README.md
└── .gitignore
