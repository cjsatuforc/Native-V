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
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild(renderer.domElement);

composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );

var effect2 = new THREE.ShaderPass( getDistortionShaderDefinition() );
composer.addPass( effect2 );
effect2.renderToScreen = true;
setupDistortionEffectAndGUI(effect2);

var distortion;

function setupDistortionEffectAndGUI(effect2){

    var distortionParameters = {
        horizontalFOV:		54,
        strength: 			0.5,
        cylindricalRatio:	2,
    };

    distortion = distortionParameters;

    updateDistortionEffect = function() {


        var height = Math.tan(THREE.Math.degToRad(distortion.horizontalFOV) / 2) / camera.aspect;

        camera.fov = Math.atan(height) * 2 * 180 / 3.1415926535;
        camera.updateProjectionMatrix();


        effect2.uniforms[ "strength" ].value = distortion.strength;
        effect2.uniforms[ "height" ].value = height;
        effect2.uniforms[ "aspectRatio" ].value = camera.aspect;
        effect2.uniforms[ "cylindricalRatio" ].value = distortion.cylindricalRatio;
        console.log(effect2.uniforms[ "cylindricalRatio" ].value)

    };

    updateDistortionEffect();
}

function getDistortionShaderDefinition(){
    return {

        uniforms: {
            "tDiffuse": 		{ type: "t", value: null },
            "strength": 		{ type: "f", value: 0 },
            "height": 			{ type: "f", value: 1 },
            "aspectRatio":		{ type: "f", value: 1 },
            "cylindricalRatio": { type: "f", value: 1 }
        },

        vertexShader: [
            "uniform float strength;",          // s: 0 = perspective, 1 = stereographic
            "uniform float height;",            // h: tan(verticalFOVInRadians / 2)
            "uniform float aspectRatio;",       // a: screenWidth / screenHeight
            "uniform float cylindricalRatio;",  // c: cylindrical distortion ratio. 1 = spherical

            "varying vec3 vUV;",                // output to interpolate over screen
            "varying vec2 vUVDot;",             // output to interpolate over screen

            "void main() {",
            "gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));",

            "float scaledHeight = strength * height;",
            "float cylAspectRatio = aspectRatio * cylindricalRatio;",
            "float aspectDiagSq = aspectRatio * aspectRatio + 1.0;",
            "float diagSq = scaledHeight * scaledHeight * aspectDiagSq;",
            "vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));",

            "float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;",
            "float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);",

            "vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;",
            "vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);",
            "vUV.xy += uv;",
            "}"
        ].join("\n"),

        fragmentShader: [
            "uniform sampler2D tDiffuse;",      // sampler of rendered scene�s render target
            "varying vec3 vUV;",                // interpolated vertex output data
            "varying vec2 vUVDot;",             // interpolated vertex output data

            "void main() {",
            "vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;",
            "gl_FragColor = texture2DProj(tDiffuse, uv);",
            "}"
        ].join("\n")

    };
}

effect = new THREE.StereoEffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    effect.setSize( window.innerWidth, window.innerHeight );
}


//getting init parms
// cameraInit();
animate();

function animate(){
    requestAnimationFrame(animate);
    render();
}


function render(){


    //- if (camera.flighAround){
    //- object.rotation.y=r*Math.sin(timer);
    //- }

    if (camera.lookAtObj) {
        camera.lookAt(scene.position);
    }
    effect.render( scene, camera );
    // renderer.render(scene, camera);
}
