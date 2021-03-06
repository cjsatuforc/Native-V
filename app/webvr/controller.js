


//Recieve updted camera and apply to existing
ipcRenderer.on('update-camera', function(event, arg) {
    camera.position.x = arg.position.x;
    camera.position.y = arg.position.y;
    camera.position.z = arg.position.z;
    camera.rotation.x = arg.rotation.x;
    camera.rotation.y = arg.rotation.y;
    camera.rotation.z = arg.rotation.z;
    camera.lookAtObj = arg.lookAtObj;
});

//Recieve updted scope
ipcRenderer.on('update-native', function(event, arg) {
    native = arg;
});

var native = native;

(function(){
    angular
        .module('app', ['ngMaterial', 'ngAnimate'])
        .controller('ViewController', ['$scope', ViewController]);

    function ViewController($scope) {

        $scope.native = native;
        $scope.camera = camera;

        //recieve updated scope from ipcMain an
        ipcRenderer.on('update-native', function(event, arg) {
            $scope.native = arg;
            $scope.$apply();
        });

        //updatescope of mainWindow
        ipcRenderer.on('update-camera', function(event, arg) {
            $scope.native.camera = arg;
        });

        //updatescope of mainWindow
        ipcRenderer.on('update-window', function(event, arg) {
            $scope.native.desktopWindow = arg;
        });

        //sending scope to ipcMain
        $scope.sendNative = function () {
            native = $scope.native
            ipcRenderer.send('send-native', native);
        }

        //sending CAMERA scope to ipcMain
        $scope.sendCamera = function () {
            ipcRenderer.send('send-camera', native.camera);
        }

        //sending Window scope to ipcMain
        $scope.sendWindow = function () {
            ipcRenderer.send('send-window', native.desktopWindow);
        }

        $scope.sendModel = function () {
            ipcRenderer.send('send-model', native.model);
        }

        // $scope.resetCamera = function () {
        //     console.log('NADO SDELAT')
        //     ipcRenderer.send('send-camera', native.camera);
        // }

        $scope.togglePreview = function(){
            ipcRenderer.send('toggle-preview', native.preview);
        }

        $scope.enterVR = function(){
          ipcRenderer.send('open-vr');
        }

        $scope.save = function(){
            localstorage.setItem('native', JSON.stringify(native));
        }

        $scope.reloadPage = function () {
            location.reload();
        }

        $scope.updateModel = function(model){
            loadModel(model.file, model.scale, model.position, model.rotation);
        }

        $scope.HttpGet = function(request){
            httpGet(request);
        }

        $scope.sendNative();
        $scope.sendCamera();
        $scope.sendWindow();
    }
})();



function getFace(facos){
    // data = facos[0];
    // native.headtracking.head.position.x = data.translationX;
    // native.headtracking.head.position.y = data.translationY;
    // native.headtracking.head.rotation.x = data.rotationX;
    // native.headtracking.head.rotation.y = data.rotationY;
    // native.headtracking.head.rotation.z = data.rotationZ;
    // native.headtracking.head.scale = data.scale;
    // ipcRenderer.send('send-native', native);
}

function getSmile(smileFactor){
//     if (smileFactor > 0.6){
//         native.headtracking.head.smile = true;
//     } else {
//         native.headtracking.head.smile = false;
//     }
//
}


// function streamData(Data){
//     if (settings.eyetracking){
//         var pointer = document.getElementById('pointer');
//         var faceData = Data;
//         var gaze = faceData.getGazeDirectionGlobal();
//         var gazeX = window.innerWidth / 2;
//         var gazeY = window.innerHeight / 2;
//         var transformY = (gaze[0]*3) * gazeY;
//         var transformX = (gaze[1]*2) * gazeX;
//         pointer.style.opacity = 1;
//         pointer.style.transform = 'translate3d('+ -transformX + 'px,' + transformY + 'px,0)';
//     }
// }
