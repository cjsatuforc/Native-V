if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {ipcMain} = electron;
const os = require('os');
var path = require('path')
var fs = require('fs');


// //Menubar
// var menubar = require('menubar')
// var mb = menubar({
//     index: 'file://' + __dirname + '/settings.html'
// })
//
// mb.on('ready', function ready () {
// })



const logger = require('winston');
logger.level = 'debug';
global.logger = logger;


app.on('window-all-closed', function() {
    app.quit();
});

app.commandLine.appendSwitch('--enable-experimental-web-platform-features')


app.on('ready', function() {

    logger.debug("Starting application");

    var mainWindow = new BrowserWindow({
        width: 950,
        height: 550,
        toolbar: true,
        title: "Native",
        transparent: true,
        frame: true,
        titleBarStyle: 'hidden-inset'
    });
    mainWindow.loadURL('file://' + __dirname + "/index.html");
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
    mainWindow.openDevTools();


    var prefsWindow = new BrowserWindow({
        width: 300,
        height: 600,
        show: false,
        transparent: true,
        frame: true,
        titleBarStyle: 'hidden-inset',
        toolbar: true,
        x: 100,
        y: 150
    })


    // var nativeHandleBuffer = mainWindow.getNativeWindowHandle();
    // var electronVibrancy = require(path.join(__dirname,'..','..'));
    // electron.remote.getCurrentWindow().setVibrancy('medium-light')
    // SetVibrancy(mainWindow, 6)

    prefsWindow.loadURL('file://' + __dirname + '/settings.html');
    prefsWindow.show();
    prefsWindow.openDevTools();

    require('./scripts/components/menu/mainmenu');

    ipcMain.on('toggle-prefs', function () {
        if (prefsWindow.isVisible())
            prefsWindow.hide()
        else
            prefsWindow.show()
    })

    //ipcMain receive scope from Angular and send it back to mainview's ipcRenderer
    ipcMain.on('send-native', function(event, arg) {
        mainWindow.webContents.send('update-native', arg);
    });

    //receive CAMERA and send back
    ipcMain.on('send-camera', function(event, arg) {
        mainWindow.webContents.send('update-camera', arg);
        prefsWindow.webContents.send('update-camera', arg);
    });


});
