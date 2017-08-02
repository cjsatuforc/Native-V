if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {Notification} = electron;
const {ipcMain} = electron;
const {protocol} = require('electron');

const os = require('os');
var path = require('path')
var fs = require('fs');

//Menubar
var menubar = require('menubar')
var mb = menubar({
    index: 'file://' + __dirname + '/settings.html',
    icon:  'file://' + __dirname + '/assets/IconTemplate.png',
    tooltip: 'Native',
    width: 300,
    height: 600,
    showDockIcon: true,
    transparent: true,
    frame: true,
    vibrancy: 'dark',
    alwaysOnTop: true,
    titleBarStyle: 'hidden'
})

mb.on('ready', function ready () {
})


const logger = require('winston');
logger.level = 'debug';
global.logger = logger;


app.on('window-all-closed', function() {
    app.quit();
});

app.commandLine.appendSwitch('--enable-experimental-web-platform-features')
app.commandLine.appendSwitch('--enable-webvr')
app.commandLine.appendSwitch('--enable-gamepad-extensions')

// protocol.registerStandardSchemes(['native'])

app.on('ready', function() {


    // protocol.registerBufferProtocol('native', (request, callback) => {
    //   callback({mimeType: 'text/html', data: Buffer.from('<h5>Response</h5>')});
    //   console.error('norm')
    // }, (error) => {
    //   if (error) console.error('Failed to register protocol')
    // })

    protocol.registerHttpProtocol('native', (request, callback) => {
        console.log("HELLO WORLD");
        console.log(request, callback);
        const url = request.url.substr(7)
        callback({path: path.normalize(`${__dirname}/${url}`)})
      }, (error) => {
        if (error) console.error(error)
      })



    logger.debug("Starting application");

    var mainWindow = new BrowserWindow({
        width: 750,
        height: 400,
        toolbar: false,
        title: "Electron",
        transparent: true,
        frame: false,
        titleBarStyle: 'hidden-inset',
        vibrancy: 'dark',
        icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
        x: 1500,
        y: 1000,
        show: true,
        alwaysOnTop: true
    });

    mainWindow.loadURL('file://' + __dirname + "/index.html");


    mainWindow.on('closed', function() {
        mainWindow = null;
    });


    var prefsWindow = new BrowserWindow({
        width: 300,
        height: 600,
        show: true,
        transparent: true,
        frame: false,
        titleBarStyle: 'hidden-inset',
        toolbar: false,
        x: 100,
        y: 150,
        vibrancy: 'dark'
    })


    prefsWindow.loadURL('file://' + __dirname + '/settings.html');

    require('./scripts/components/menu/mainmenu');

    ipcMain.on('toggle-prefs', function () {
        if (prefsWindow.isVisible())
            prefsWindow.hide()
        else
            prefsWindow.show()
    })

    ipcMain.on('toggle-preview', function (arg) {
        if (arg){
            mainWindow.show()
        }else{
            mainWindow.hide()
            }
    })

    ipcMain.on('open-vr', function (arg) {
      shell.openExternal('http://localhost:8080');
    })

    //ipcMain receive scope from Angular and send it back to mainview's ipcRenderer
    ipcMain.on('send-native', function(event, arg) {
            mainWindow.webContents.send('update-native', arg);
    });

    ipcMain.on('send-model', function(event, arg) {
            mainWindow.webContents.send('update-model', arg);
    });

    ipcMain.on('enterVR', function(event, arg) {
        mainWindow.webContents.send('enterVR', arg);
    });

    //receive CAMERA and send back
    ipcMain.on('send-camera', function(event, arg) {
            mainWindow.webContents.send('update-camera', arg);
            prefsWindow.webContents.send('update-camera', arg);
    });

    //receive Window and send back
    ipcMain.on('send-window', function(event, arg) {
            mainWindow.webContents.send('update-window', arg);
            prefsWindow.webContents.send('update-window', arg);
    });

    //ipcMain receive scope from Angular and send it back to mainview's ipcRenderer
    ipcMain.on('http-get', function(event, arg) {
            mainWindow.webContents.send('http-get', arg);
            prefsWindow.webContents.send('http-get', arg);
    });

    ipcMain.on('source-id-selected', (event, sourceId) => {
        mainWindow.webContents.send('source-id-selected', sourceId)
    })

    ipcMain.on('show-picker', (event, options) => {
       prefsWindow.webContents.send('get-sources', options)

    })


    //Setup express server for api
    const express = require('express');
    const bodyParser = require('body-parser');
    const api = express();

    //setup webserver
    const server = require('http').createServer(api);


    api.use(bodyParser.json({ limit: '50mb' }))

    api.get('/', function (req, res) {
        res.send(null);
    })

    api.get('/setting', function(req, res) {
        if (prefsWindow.isVisible())
            prefsWindow.hide()
        else
            prefsWindow.show()
        res.send(null);
    });

    api.get('/mini-preview', function(req, res) {
        mainWindow.setSize(340, 200);
        mainWindow.webContents.send('update-native', arg);
        res.send(null); // send Null back to end request
    });

    api.get('/loadmodel', function(req, res) {
        mainWindow.webContents.send('loadmodel');
        res.send(null); // send Null back to end request
    });

    api.get('/updatemodel', function(req, res) {
        mainWindow.webContents.send('updatemodel');
        res.send(null); // send Null back to end request
    });

    api.get('/updatewindow', function(req, res) {
        mainWindow.webContents.send('updatewindow');
        res.send(null); // send Null back to end request
    });

    api.get('/fusion-connected', function(req, res) {
        mainWindow.webContents.send('fusionConnected');
        // mainWindow.webContents.send('get-sources');
        // mainWindow.webContents.send('updatewindow');
        res.send(null); // send Null back to end request
    });

    api.get('/fusion-disconnected', function(req, res) {
        mainWindow.webContents.send('fusionDisconnected');
        res.send(null); // send Null back to end request
    });

    api.get('/open-dev-tools', function(req, res) {
        mainWindow.openDevTools();
        prefsWindow.openDevTools();
        res.send(null); // send Null back to end request
    });

    api.listen(3000, function () {
      console.log('Api is on port 3000!')
    });


    // api.get('/gyro', function(req, res) {
    //     console.log('epta')
    //
    //     res.send(null); // send Null back to end request
    // });


});
