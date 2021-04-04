# Zoetrope

## program

_program.js_ (entry point)

The node-server located at `program.js` runs on a basic express server with socket.io.
It facilitates connectivity to the iPads and binding to the file `speedometer.js`

_speedometer.js_

Executes the python-based readings of the Raspberry PI GPIO ASDL Accelerometer every 200 ms
and outputs the results via a socket.io listener.

_view.html & view2.html_

Presentational layers to either display the birds or dots depending on the readings received by the server.
This is handled using simple javascript conditions based on socket messages (**socket.io client**)
Client side JavaScript is directly included in these files.

## Requirements
This repository relies on a python script `adxl_node.py` located on the parent directory.

## Installation
`npm i`

_NOTE: you can use a boolean environment variable "DEBUG_MODE" to test without GPIO connectivity_

## Usage

1. connect iPads via `localhost:<your-port>`
2. assign cId (start from 0 and increment)

## Modes

_single frame rate_

Default mode: spinning speed influences number of birds.

_dots_

**add GET-param v=2 to urls** to display growing dots instead of birds

_interactive bird_

When installation is not spinning, touch interactivity defines how a single bird travels across iPads.
