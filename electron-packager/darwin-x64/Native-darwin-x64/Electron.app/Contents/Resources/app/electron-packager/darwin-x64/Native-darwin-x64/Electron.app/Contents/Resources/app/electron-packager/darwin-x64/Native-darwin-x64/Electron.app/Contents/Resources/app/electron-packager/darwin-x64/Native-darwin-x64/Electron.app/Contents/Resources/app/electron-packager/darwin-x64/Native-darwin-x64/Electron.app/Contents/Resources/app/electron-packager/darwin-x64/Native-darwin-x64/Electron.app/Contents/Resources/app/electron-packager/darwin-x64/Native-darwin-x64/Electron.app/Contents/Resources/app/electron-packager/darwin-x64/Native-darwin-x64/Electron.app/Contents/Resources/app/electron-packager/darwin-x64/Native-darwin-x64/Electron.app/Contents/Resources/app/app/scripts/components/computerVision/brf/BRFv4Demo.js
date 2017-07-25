//
// Namespace: brfv4Example structures these examples.
//

var brfv4Example = {

	appId: "brfv4.native", // Choose your own app id. 8 chars minimum.

	loader: { queuePreloader: null },	// preloading/example loading
	imageData: {						// image data source handling
		webcam: { stream: null },		// either webcam ...
		picture: {}						// ... or pictures/images
	},
	dom: {},							// html dom stuff
	gui: {},							// QuickSettings elements
	drawing: {},						// drawing the results using createJS
	drawing3d: {						// all 3D engine functions
		t3d: {}//,						// ThreeJS stuff
		//f3d: {}						// Flare3D stuff (coming later)
	},
	stats: {}							// fps meter
};

// var webcam		= document.getElementById("_webcam");		// our webcam video
// var imageData	= document.getElementById("_imageData");	// image data for BRFv4
// var brfManager	= null;
// var resolution	= null;
// var brfv4		= null;

//
// Namespace: brfv4 is the (mandatory) namespace for the BRFv4 library.
//

var webcam = document.getElementById("_webcam");
var imageData	= document.getElementById("_imageData");

// window.webContents.executeJavaScript(`document.querySelector('input[name="fb_dtsg"]').value`, function (result) {
//     console.log(result)
// })


var brfv4 = {locateFile: function(fileName) { return "scripts/components/computerVision/brf/BRFv4_JS_trial.js.mem"; }};

//
// Demo entry point: preloading js files.
//

brfv4Example.start = function() {

	brfv4Example.loader.preload([

		"scripts/components/computerVision/brf/libs//brf/BRFv4_JS_trial.js",						// BRFv4 SDK

		"scripts/components/computerVision/brf/utils/adapter-latest.js",	// webcam polyfill for older browsers


		// "libraries/BRF/libs/highlight/highlight_tomorrow.css",				// code highlighter
		// "libraries/BRF/libs/highlight/highlight.pack.js",

		"scripts/components/computerVision/brf/libs/createjs/easeljs-0.8.2.min.js",				// canvas drawing lib
		// "libraries/BRF/libs/threejs/three.js",								// ThreeJS: a 3D engine

		"scripts/components/computerVision/brf/utils/BRFv4DOMUtils.js",							// DOM handling
		// "libraries/BRF/utils/BRFv4Stats.js",								// FPS meter

		"scripts/components/computerVision/brf/utils/BRFv4DrawingUtils_CreateJS.js",				// BRF result drawing
		// "scripts/components/computerVision/brf/utils/BRFv4Drawing3DUtils_ThreeJS.js",				// ThreeJS 3d object placement.

		"scripts/components/computerVision/brf/utils/BRFv4SetupWebcam.js",							// webcam handling
		"scripts/components/computerVision/brf/utils/BRFv4SetupPicture.js",						// picture/image handling
		"scripts/components/computerVision/brf/utils/BRFv4SetupExample.js",						// overall example setup

		"scripts/components/computerVision/brf/utils/BRFv4PointUtils.js",							// some calculation helpers

		// "libraries/BRF/utils/BRFv4SetupChooser.js",						// gui: choose either webcam or picture
		// "libraries/BRF/utils/BRFv4ExampleChooser.js",						// gui: choose an example
		// "libraries/BRF/utils/BRFv4DownloadChooser.js",						// gui: choose which package to download

		// example to load on startup, others can be chosen via the example chooser GUI.

		"scripts/components/computerVision/brf/examples/face_tracking/smile_detection.js"		// start with this example
        // "libraries/BRF/examples/face_tracking/ThreeJS_example.js"		// start with this example


	], function() {

		brfv4Example.init("webcam");

	});
};

//
// Helper stuff: logging and loading
//

// Custom way to write to a log/error to console.

brfv4Example.trace = function(msg, error) {
	if(typeof window !== 'undefined' && window.console) {
		var now = (window.performance.now() / 1000).toFixed(3);
		if(error) {	window.console.error(now + ': ', msg); }
		else { window.console.log(now + ': ', msg); }
	}
};

// loading of javascript files:

// preload(filesToLoad, callback) // filesToLoad (array)
// loadExample(filesToLoad, callback) // filesToLoad (array)
// setProgressBar(percent, visible)

(function () {
	"use strict";

	var loader = brfv4Example.loader;

	loader.preload = function (filesToLoad, callback) {

		if (loader.queuePreloader !== null || !filesToLoad) {
			return;
		}

		function onPreloadProgress(event) {
			loader.setProgressBar(event.loaded, true);
		}

		function onPreloadComplete(event) {
			loader.setProgressBar(1.0, false);
			if(callback) callback();
		}

		var queue = loader.queuePreloader = new createjs.LoadQueue(true);
		queue.on("progress", onPreloadProgress);
		queue.on("complete", onPreloadComplete);
		queue.loadManifest(filesToLoad, true);
	};

	loader.loadExample = function (filesToLoad, callback) {

		function onProgress(event) {
			loader.setProgressBar(event.loaded, true);
		}

		function onComplete(event) {
			loader.setProgressBar(1.0, false);
			if(callback) callback();
		}

		var queue = loader.queueExamples = new createjs.LoadQueue(true);
		queue.on("progress", onProgress);
		queue.on("complete", onComplete);
		queue.loadManifest(filesToLoad, true);
	};

	loader.setProgressBar = function(percent, visible) {

		var bar = document.getElementById("_progressBar");
		if(!bar) return;

		if(percent < 0.0) percent = 0.0;
		if(percent > 1.0) percent = 1.0;

		var width = Math.round(percent * 640);
		var color = 0xe7e7e7;

		bar.style.width = width + "px";
		bar.style.backgroundColor = "#" + color.toString(16);
		bar.style.display = visible ? "block" : "none";
	};
})();

// brfv4Example.start();