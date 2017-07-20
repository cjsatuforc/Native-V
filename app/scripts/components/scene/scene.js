var container, neck, scene, renderer, composer, effect;
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

var lineGeometry = new THREE.Geometry();
lineGeometry.dynamic = true;
lineGeometry.verticesNeedUpdate = true;
lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
lineGeometry.vertices.push(new THREE.Vector3(100, 200, 900));
var line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);


neck.add(camera);
scene.add(neck);

neck.rotation._y = 100  // Y first
neck.rotation._x = 200;  // X second

// object
var loader = new THREE.STLLoader();

loader.load( 'assets/cat.stl', function ( geometry ) {
    var material=new THREE.MeshNormalMaterial({
        linewidth: 0.01,
        wireframe: true,
        transparent: true,
        opacity: 1,
    });
    var mesh=new THREE.Mesh(geometry, material);
    mesh.name="model"
    mesh.scale.set(0.7, 0.7, 0.7);
    mesh.translateY(3)
    mesh.translateX(0)
    mesh.translateZ(0)

    mesh.rotateX(-1.3)
    mesh.rotateZ(1.0)

    mesh.material.needsUpdate = true;

    //MODEL HERE
    scene.add(mesh);
} );


// renderer
renderer = new THREE.WebGLRenderer( { alpha: true } );

container.appendChild(renderer.domElement);

if (!mono){
    renderer.setPixelRatio( window.devicePixelRatio ); //????

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    effect = new THREE.StereoEffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
}


window.addEventListener( 'resize', onWindowResize, false );


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
        color: 0x01BE00,
        side: THREE.BackSide
    });

    var skybox = new THREE.Mesh(geometry, material);
    scene.add(skybox);
    skybox.scale.set(40, 40, 40);
}

neck = new THREE.Object3D();

camera.flighAround = false;


function onWindowResize(){

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        effect.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


//getting init parms
// cameraInit();
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
    object.rotation.z=r*Math.sin(timer);

    if (camera.lookAtObj) {
        camera.lookAt(scene.position);
    }
    if (!mono){
        effect.render( scene, camera );
    } else {
        renderer.render(scene, camera);
    }
}
