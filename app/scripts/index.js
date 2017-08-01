const electron = require('electron');
const {ipcRenderer} = electron;
const {remote} = electron;

const {desktopCapturer} = require('electron');
const domify = require('domify')


ipcRenderer.on('get-sources', (event, options) => {
  desktopCapturer.getSources(options, (error, sources) => {
    if (error) throw error
    let sourcesList = document.querySelector('.capturer-list');
    sourcesList.innerHTML = "";
    for (let source of sources) {
      let thumb = source.thumbnail.toDataURL()
      if (!thumb) continue
      let title = source.name.slice(0, 20)
    //   let item = `<li><a href="#"><img src="${thumb}"><span>${title}</span></a></li>`
      let item = `<li><a href="#"><span>${title}</span></a></li>`
      sourcesList.appendChild(domify(item))
    }
    let links = sourcesList.querySelectorAll('a');
    for (let i = 0; i < links.length; ++i) {

     if (sources[i].name == 'Autodesk Fusion 360') {
       ipcRenderer.send('source-id-selected', sources[i].id);
     }

      // on click
      let closure = (i) => {
        return (e) => {
          e.preventDefault()
          ipcRenderer.send('source-id-selected', sources[i].id)
        }
      }
      links[i].onclick = closure(i)
    }
  })
})


let localStream

const playVideo = () => {
  remote.dialog.showOpenDialog({properties: ['openFile']}, (filename) => {
    console.log(filename)
    let video = document.querySelector('video')
    video.muted = false
    video.src = filename
  })
}

// ipcRenderer.send('show-picker', { types: ['screen'] })
ipcRenderer.send('show-picker', { types: ['window'] })

ipcRenderer.on('fusionConnected', (event, sourceId) => {
    ipcRenderer.send('show-picker', { types: ['window'] })
})

ipcRenderer.on('source-id-selected', (event, sourceId) => {
  if (!sourceId) return
  console.log(sourceId)
  onAccessApproved(sourceId)
})

const recordDesktop = () => {
  ipcRenderer.send('show-picker', { types: ['screen'] })
}

const recordWindow = () => {
  ipcRenderer.send('show-picker', { types: ['window'] })
}

const play = () => {
  // Unmute video.
  let video = document.querySelector('video')
  video.muted = false
  let blob = new Blob(recordedChunks, {type: 'video/webm'})
  video.src = window.URL.createObjectURL(blob)
}

const getMediaStream = (stream) => {
  let video = document.querySelector('video')
  video.src = URL.createObjectURL(stream)
  localStream = stream
  stream.onended = () => { console.log('Media stream ended.') }
  let videoTracks = localStream.getVideoTracks()
  httpGet('updatewindow');
}

const getUserMediaError = () => {
  console.log('getUserMedia() failed.')
}

const onAccessApproved = (id) => {
  if (!id) {
    console.log('Access rejected.')
    return
  }
  console.log('Window ID: ', id)
  navigator.webkitGetUserMedia({
    audio: false,
    video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: id,
      maxWidth: window.screen.width, maxHeight: window.screen.height } }
  }, getMediaStream, getUserMediaError)

}


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

localStorage.clear(); ///TEMPORARY

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


function httpGet(request) {
    var url = "http://localhost:3000/";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url + request, false );
    xmlHttp.send ( null );
    return xmlHttp.responseText;
}



//AUTODESK FUSION HANDLERS

ipcRenderer.on('fusionConnected', function(event, arg) {
    new Notification('Native', {body: 'Autodesk Fusion Connected'})
})

ipcRenderer.on('fusionDisconnected', function(event, arg) {
    new Notification('Native', {body: 'Autodesk Fusion Disconnected'})
})
