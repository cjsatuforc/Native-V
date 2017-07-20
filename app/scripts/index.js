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


//creating empty set of objects
var native;

camera = {
    position: {
        x: 0,
        y: 0,
        z: 150
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    lookAtObj: true
}


native = {
    camera: {
        position: {
            x: 0,
            y: 0,
            z: 140
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        lookAtObj: true
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
    }
}
