if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {ipcMain} = electron;

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

app.setAsDefaultProtocolClient('native');

app.on('ready', function() {

    logger.debug("Starting application");

    var mainWindow = new BrowserWindow({
        width: 950,
        height: 550,
        toolbar: false,
        title: "Native",
        transparent: true,
        frame: false,
        titleBarStyle: 'hidden-inset',
        vibrancy: 'dark',
        x: 1500,
        y: 0,
        show: true,
        // alwaysOnTop: true
    });

    // mainWindow.loadURL('file://' + __dirname + "/index.html");
    mainWindow.loadURL('file://' + __dirname + "/scripts/components/webvr/index.html");


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


    mainWindow.openDevTools();
    prefsWindow.openDevTools();

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

});
