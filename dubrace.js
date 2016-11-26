// Dubrace.js

var gameSettings = {
    playerSpeed: 1,
    groundSize: 50,
    groundPrerender: 3, // Number of grounds in front to render
}

// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");
var kb = new Keyboard(window);

var player;
var ground = new Array();

// This begins the creation of a function that we will 'call' just after it's built
var createScene = function () {

    // Create babylon scene
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    // Set camera
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 4, 12), scene);

    // Create lights
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .7;

    // Create sphere and ground
    player = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    player.material = new BABYLON.StandardMaterial("metalTexture", scene);
    player.material.diffuseTexture = new BABYLON.Texture("textures/metal.jpg", scene);
    player.position.y = 1;

    camera.target = player;
    camera.radius = 20;
    camera.heightOffset = 5;

    // Create ground textures
    for (var i=0; i<gameSettings.groundPrerender; i++) {
        var ng = BABYLON.Mesh.CreateGround("ground1", 6, gameSettings.groundSize, 2, scene);
        ng.position.z = -i * gameSettings.groundSize;
        ng.material = new BABYLON.StandardMaterial("arrowTexture", scene);
        ng.material.diffuseTexture = new BABYLON.Texture("textures/arrows.jpg", scene);
        ng.material.diffuseTexture.uScale = 1.0;
        ng.material.diffuseTexture.vScale = 1.0;

        ground.push(ng);
    }

    // Create action manager

    // Leave this function
    return scene;

};  // End of createScene function

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();

engine.runRenderLoop(function () {
    // Move player
    player.position.z-=gameSettings.playerSpeed;
    player.rotation.x-=0.2;

    // Shift old ground tile to front
    if (player.position.z < ground[0].position.z - gameSettings.groundSize) {
        var og = ground.shift();
        og.position.z = ground[ground.length-1].position.z - gameSettings.groundSize;
        ground.push(og);
    }

    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
