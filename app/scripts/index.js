
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

var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        document.body.className = "loaded";
    }
}, 100);

document.addEventListener('DOMContentLoaded', boot);

var localstorage = window.localStorage;



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
