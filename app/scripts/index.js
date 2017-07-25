const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;

function boot() {

    angular
        .module('app')

    angular.bootstrap(document, ['app'], {
        strictDi: true
    });
}

document.addEventListener('DOMContentLoaded', boot);

var localstorage = window.localStorage;

//creating empty set of objects
var native;
var camera;

native = {
    camera: {
        position: {
            x: 0,
            y: 0,
            z: 190
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        lookAtObj: true,
        stereo: false,
    },
    model: {
        position: {
            x: 0,
            y: 0,
            z: 0
        },
        rotation: {
            x: -1,
            y: 0,
            z: 0,
        },
        rotate: true,
    },
    headtracking: {
        active: true,
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
    debuger: true
}

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
