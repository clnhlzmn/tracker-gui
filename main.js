const { app, Menu, MenuItem, BrowserWindow, ipcMain } = require('electron')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const isMac = process.platform === 'darwin'

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      { label: 'Open' },
      { label: 'Save' },
      { label: 'Save As' },
      isMac ? { role: 'close' } : { role: 'quit' },
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

let serialPortMonitor = undefined
    
let serialport = undefined

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    if (serialPortMonitor === undefined) {
        const serialPortListener = (portInfo) => {
            if (serialport) { 
                return 
            }
            console.log(`new serial port at ${portInfo.path}`)
            serialport = new SerialPort(portInfo.path)
            serialport.on('close', () => {
                console.log(`serial port ${portInfo.path} closed`)
                serialport = undefined
            })
            const parser = new Readline()
            serialport.pipe(parser)
            parser.on('data', line =>
                win.webContents.send('new-data', line)
            )
        }
        serialPortMonitor = new SerialPortMonitor(serialPortListener, '03EB', '2404')
        serialPortMonitor.begin()
    }
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const delay = time => new Promise(res=>setTimeout(res,time));

class SerialPortMonitor {
    constructor(listener, vid, pid) {
        this.listener = listener
        this.vid = vid
        this.pid = pid
        this.active = false
    }
    setListener(listener) {
        this.listener = listener
    }
    async begin() {
        this.active = true;
        while (this.active) {
            await delay(1000)
            const portInfoList = await SerialPort.list()
            portInfoList.forEach((pi) => {
                if (pi.vendorId === this.vid && pi.productId === this.pid && this.listener) {
                    this.listener(pi)
                }
            })
        }
    }
    end() {
        this.active = false
    }
}
