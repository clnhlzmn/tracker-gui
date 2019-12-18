const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

SerialPort.list().then(function (ports) {
    console.log("thisis the list callback");
    ports.forEach(function(port) {
        console.log(port.path);
        console.log(port.pnpId);
        console.log(port.manufacturer);
    });
});

const port = new SerialPort('COM7', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

const listeners = []

parser.on('data', line =>
    listeners.forEach(listener => listener(line))
)

exports.addRXListener = function(listener) {
    listeners.push(listener)
}

