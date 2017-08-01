var express = require('express');
var path    = require("path");
var fs      = require('fs');
var pug     = require('pug');
var http    = require('http');


//setup webserver
var app = require('http').createServer(app);


var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

var SerialPort = require('serialport');
var serialport = new SerialPort("/dev/cu.usbmodem1451", {
    baudRate: 57600,
    parser: SerialPort.parsers.readline('\n')
});

var gyroData;

serialport.on('open', function(){
    console.log('Serial Port Opend');
    serialport.on('data', function(data){
        gyroData = data;
          console.log(data)
        updateShit(data);
    });
});

});
