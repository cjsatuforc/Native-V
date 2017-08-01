var container, neck, scene, renderer, composer, stereorender;
var camera;
var object;
var updateDistortionEffect;

container=document.createElement('div');
document.body.appendChild(container);

function degInRad(deg) {
    return deg * Math.PI / 180;
}

scene=new THREE.Scene();

camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);

neck = new THREE.Object3D();
neck.up = new THREE.Vector3(0, 0, 1);
neck.position.z = 1;
neck.position.y = 0;

var lineMaterial =  new THREE.LineDashedMaterial( {
    color: 0xff0000,
    scale: 2,
    dashSize: 3,
    gapSize: 10,
});


if (native.laser){
    var lineGeometry = new THREE.Geometry();
    lineGeometry.dynamic = true;
    lineGeometry.verticesNeedUpdate = true;
    lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(100, 200, 900));
    var line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
}


neck.add(camera);
scene.add(neck);

neck.rotation._y = 100  // Y first
neck.rotation._x = 200;  // X second

// object
var loader = new THREE.STLLoader();

loadModel();

function loadModel(){

    loader.load( 'assets/model.stl', function ( geometry ) {
        var material = new THREE.MeshNormalMaterial({
            linewidth: 0.00001,
            wireframe: true,
            transparent: true,
            opacity: 0.5,
        });
        var mesh=new THREE.Mesh(geometry, material);
        mesh.name="model"
        mesh.scale.set(0.3, 0.3, 0.3);
        mesh.translateY(-1.4)
        mesh.translateX(0)
        mesh.translateZ(0)
        mesh.rotateX(0)
        mesh.rotateZ(0)
        mesh.material.needsUpdate = true;
        scene.add(mesh);
    });

}

ipcRenderer.on('updatemodel', function(event, arg) {
    var object = scene.getObjectByName("model");
    scene.remove(object);
    loadModel();
})


	//
	// // create the video element
	// video = document.createElement( 'video' );
	// // video.id = 'video';
	// // video.type = ' video/ogg; codecs="theora, vorbis" ';
	// video.src = "videos/sintel.ogv";
	// video.load(); // must call after setting/changing source
	// video.play();



	// alternative method --
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:




    function loadScreen(){
        var windowObj = scene.getObjectByName("window");
        var textureObj = scene.getObjectByName("videotexture");
        scene.remove(windowObj);

        scale = 0.05;

        //Get size
        var video = document.getElementById( 'video' );
        video.load();
        video.addEventListener( "loadedmetadata", function (e) {
            videoHeight = video.videoHeight;
            videoWidth = video.videoWidth;
            movieGeometry = new THREE.PlaneGeometry( videoWidth * scale, videoHeight * scale, 1, 1 );
            video.play();

            console.log(video.src)
        });

        setupScreen();
        function setupScreen() {

            videoImage = document.createElement( 'canvas' );
            videoImage.width = videoWidth;
            videoImage.height = videoHeight;

            videoImageContext = videoImage.getContext( '2d' );
            videoImageContext.fillRect( 0, 0, videoWidth, videoHeight );

            videoTexture = new THREE.Texture( videoImage );
            videoTexture.name = "videotexture"
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;

            movieMaterial = new THREE.MeshBasicMaterial( {
                map: videoTexture,
                overdraw: true,
                side:THREE.DoubleSide,
                opacity: 0.8
            } );
            movieMaterial.name = "movieMaterial"

            var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
            movieScreen.position.set(0,0,0);
            movieScreen.name = "window"
            scene.add(movieScreen);

            var object = scene.getObjectByName("window");
            var position = native.desktopWindow.position;
            var rotation = native.desktopWindow.rotation;
            object.position.x = position.x;
            object.position.y = position.y;
            object.position.z = position.z;
            object.rotation.x = rotation.x;
            object.rotation.y = rotation.y;
            object.rotation.z = rotation.z;
        }
    }

    ipcRenderer.on('updatewindow', function(event, arg) {
        loadScreen();
    })

    ipcRenderer.on('update-native', function(event, arg) {
        var object = scene.getObjectByName("window");
        var position = native.desktopWindow.position;
        var rotation = native.desktopWindow.rotation;
        object.position.x = position.x;
        object.position.y = position.y;
        object.position.z = position.z;
        object.rotation.x = rotation.x;
        object.rotation.y = rotation.y;
        object.rotation.z = rotation.z;
    });



window.addEventListener( 'resize', viewResize, false );


var boxWidth = 90;
var skyloader = new THREE.TextureLoader();
skyloader.load('assets/box.png', onTextureLoaded);

function onTextureLoaded(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(boxWidth, boxWidth);

    var geometry = new THREE.BoxGeometry(boxWidth, boxWidth, boxWidth);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.4,
        color: 0x0B5394,
        side: THREE.BackSide
    });

    var skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);
    skybox.scale.set(40, 40, 40);
}

neck = new THREE.Object3D();



function viewResize(){
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize( window.innerWidth, window.innerHeight );
        stereorender.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
}

setRenderer();

function setRenderer(){

        renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );

        stereorender = new THREE.StereoEffect( renderer );
        stereorender.setSize( window.innerWidth, window.innerHeight );

        composer = new THREE.EffectComposer( renderer );
        composer.addPass( new THREE.RenderPass( scene, camera ) );


        container.appendChild(renderer.domElement);

    viewResize();
}

setTimeout(function(){
    var fluid = document.getElementById("fluid");
    fluid.className += 'loaded';
    console.log('anything?');
}, 3000);



animate();

function animate(){
    requestAnimationFrame(animate);
    render();
}

function render(){

    var timer=Date.now() * 0.000001;
    var r=150;
    // var faceData = faceData;
    var object = scene.getObjectByName("model");
    object.rotation.y=r*Math.sin(timer);

    if ( video.readyState === video.HAVE_ENOUGH_DATA )
    {
    videoImageContext.drawImage( video, 0, 0 );
    if ( videoTexture )
        videoTexture.needsUpdate = true;
    }

    if (camera.lookAtObj) {
        camera.lookAt(scene.position);
    }

    if (native.camera.stereo){
        stereorender.render( scene, camera);
    } else {
       renderer.render(scene, camera);
    }
}
