



//Recieve updted scope
ipcRenderer.on('update-native', function(event, arg) {
    native = arg;
});


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
            console.log('Native scope updated');
            $scope.$apply();
        });


        $scope.saveConfigs = function () {
            localstorage.setItem('native', JSON.stringify(native));
            console.log('localStorage updated;')
        }


        //updatescope of mainWindow
        ipcRenderer.on('update-camera', function(event, arg) {
            $scope.native.camera = arg;
        });

        //updatescope of mainWindow
        ipcRenderer.on('update-window', function(event, arg) {
            $scope.native.desktopWindow = arg;
            console.log('window updated;')
        });

        ipcRenderer.on('reset-window-pos', function(event, arg) {
            $scope.native.desktopWindow.position.x = 0;
            $scope.native.desktopWindow.position.y = 0;
            $scope.native.desktopWindow.position.z = 0;
            $scope.native.desktopWindow.rotation.x = 0;
            $scope.native.desktopWindow.rotation.y = 0;
            $scope.native.desktopWindow.rotation.z = 0;
            $scope.sendNative()
            console.log('window pos reseted updated;');
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

        $scope.resetCamera = function () {
            HttpGet('reset-Camera');
        }

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
    data = facos[0];
    native.headtracking.head.position.x = data.translationX;
    native.headtracking.head.position.y = data.translationY;
    native.headtracking.head.rotation.x = data.rotationX;
    native.headtracking.head.rotation.y = data.rotationY;
    native.headtracking.head.rotation.z = data.rotationZ;
    native.headtracking.head.scale = data.scale;
    ipcRenderer.send('send-native', native);
}

function getSmile(smileFactor){
    if (smileFactor > 0.6){
        native.headtracking.head.smile = true;
    } else {
        native.headtracking.head.smile = false;
    }

}

//
// function streamData(Data){
//     if (native.eyetracking){
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


(function() {
	angular
		.module('app')
		.config(['$mdThemingProvider', configure]);
	function configure($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider
            .theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark()
            .foregroundPalette['3'] = 'yellow';
    }
})();
(function() {
    angular
        .module('app')
        .config(['$mdAriaProvider', configureAria]);
    function configureAria($mdAriaProvider) {
        $mdAriaProvider.disableWarnings();
    }
})();
