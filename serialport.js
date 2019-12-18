const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const port = new SerialPort('/dev/tty.usbmodem141241', { baudRate: 9600 })

const parser = new Readline()
port.pipe(parser)

const listeners = []

parser.on('data', line =>
    listeners.forEach(listener => listener(line))
)

exports.addRXListener = function(listener) {
    listeners.push(listener)
}

