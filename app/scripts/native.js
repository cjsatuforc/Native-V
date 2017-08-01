//creating empty set of objects
var native;
var camera;
var models;

native = {
    camera: {
        position: {
            x: -100,
            y: 60,
            z: 200,
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0,
        },
        lookAtObj: true,
        stereo: false,
    },
    model: {
        file: 'assets/model.stl',
        scale: 0.3,
        rotation: [0,0,0],
        position: [0, 0, 0],
        rotate: true,
    },
    models: [
        {
            file: 'assets/model.stl',
            scale: 0.5,
            rotation: [0,0,0],
            position: [0, 0, 0],
        },
        {
            file: 'assets/Shelby.stl',
            scale: 0.5,
            rotation: [0,0,0],
            position: [0, 0, 0],
        },
        {
            file: 'assets/native.stl',
            scale: 0.3,
            rotation: [0, 0, 0],
            position: [-5, 0, 0],
        },
    ],
    headtracking: {
        active: false,
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
    },
    visualisation: {
        selected: "Visualisation",
        types: ["Visualisation", "Fluid Dynamics", "Thermodynamics", "Stress test", "Drop test"]
    },
    debuger: false,
    laser: false,
    preview: false,
    fluid: true,
    desktopWindow: {
        active: true,
        position: {
            x: -4,
            y: -14,
            z: -66
        },
        rotation: {
            x: -0.16,
            y: -0.29,
            z: -0.12
        },
        scale: 0.05
    }
}
