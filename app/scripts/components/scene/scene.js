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

loader.load( 'assets/model.stl', function ( geometry ) {
    var material=new THREE.MeshNormalMaterial({
        linewidth: 0.01,
        wireframe: true,
        transparent: true,
        opacity: 1,
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


// loadModel(native.model.file, native.model.scale, native.model.position, native.model.rotation);
//
// function loadModel(file, scale, position, rotation){
//     loader.load( file, function ( geometry ) {
//         var material=new THREE.MeshNormalMaterial({
//             linewidth: 0.005,
//             wireframe: true,
//             transparent: true,
//             opacity: 0.7,
//         });
//         var mesh=new THREE.Mesh(geometry, material);
//         mesh.name="model"
//         mesh.scale.set(scale, scale, scale);
//         mesh.translateX(position[0])
//         mesh.translateY(position[1])
//         mesh.translateZ(position[2])
//         mesh.rotateX(rotation[0])
//         mesh.rotateY(rotation[1])
//         mesh.rotateZ(rotation[2])
//         mesh.material.needsUpdate = true;
//         scene.add(mesh);
//     });
// }



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

    if (native.camera.stereo){
    };

//     var renderer = new THREE.WebGLRenderer();
// renderer.setSize( width,height);
// document.body.appendChild( renderer.domElement );

    viewResize();
}


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

    if (camera.lookAtObj) {
        camera.lookAt(scene.position);
    }

    if (native.camera.stereo){
        stereorender.render( scene, camera);
    } else {
       renderer.render(scene, camera);
    }
}
