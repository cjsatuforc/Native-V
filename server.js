// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path')
var fs = require('fs');
var http    = require('http');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/app'));

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
           httpGet(data);
    });
});

function httpGet(request) {
    var url = "http://localhost:3000/gyro?parameter=";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url + request, false );
    xmlHttp.send ( null );
    return xmlHttp.responseText;
}
