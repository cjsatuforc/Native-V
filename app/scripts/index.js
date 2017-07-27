const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;
// const {desktopCapturer} = require('electron'); //Desktop capurer

// const repl = require('repl');


function boot() {

    angular
        .module('app')

    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
}

var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        document.body.className = "loaded";
    }
}, 100);

document.addEventListener('DOMContentLoaded', boot);

var localstorage = window.localStorage;

//creating empty set of objects
var native;
var camera;
var models;

native = {
    camera: {
        position: {
            x: -93,
            y: 60,
            z: 160,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        },
        lookAtObj: true,
        stereo: false,
    },
    model: {
        file: 'assets/model.stl',
        scale: 0.3,
        rotation: [0,0,0],
        position: [0, 0, 0],
        rotate: true,
    },
    models: [
        {
            file: 'assets/model.stl',
            scale: 0.5,
            rotation: [0,0,0],
            position: [0, 0, 0],
        },
        {
            file: 'assets/Shelby.stl',
            scale: 0.5,
            rotation: [0,0,0],
            position: [0, 0, 0],
        },
        {
            file: 'assets/native.stl',
            scale: 0.3,
            rotation: [0, 0, 0],
            position: [-5, 0, 0],
        },
    ],
    headtracking: {
        active: false,
        headtracking: false,
        fullscreen: false,
        gazetracking: false,
        head: {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: 0,
            smile: false
        }
    },
    software: {
        selected: "Autodesk Fusion",
        bundles: ["Autodesk Fusion", "Autodesk Inventor", "Autocad", "XFLOW"]
    },
    visualisation: {
        selected: "Visualisation",
        types: ["Visualisation", "Fluid Dynamics", "Thermodynamics", "Stress test", "Drop test"]
    },
    debuger: true,
    laser: false,
    preview: false
}



// Uncoment for prod
if (localstorage.native === undefined || localstorage.native === null || localstorage.native.length === 0){
    var native = native;
    localstorage.setItem('native', JSON.stringify(native));
} else {
    var native = JSON.parse(localStorage.getItem("native"));
}


ipcRenderer.on('update-native', function(event, arg) {
    native = arg;
    var localstorage = window.localStorage;
    localStorage.clear();
    localstorage.setItem('native', JSON.stringify(native));
});
