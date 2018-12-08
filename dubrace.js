// Dubrace.js


var dancer = new Dancer();
var audio = new Audio();
// audio.src = '../../examples/songs/zircon_devils_spirit.mp3';
audio.src = 'songs/test.mp3';
dancer.load(audio);
dancer.play();
var start_time = new Date();


// Dancer.js kick analysis code
var shake_on_next_drop = false;
var canKick = true;
var lastDropTime;

kick = dancer.createKick({
    onKick: function ( mag ) {
        kick.threshold = 0.42;
        kick.decay = 0.02;
        if(canKick == true)
        {
            if (lastDropTime && dancer.getTime() - lastDropTime > 10) {
                camera_shake_frames = 300;
            }
            lastDropTime = dancer.getTime();

            var color = getColor();
            ground.forEach(function(og) {
                og.material.emissiveColor = color;
            });

            console.log('Kick!');
            canKick = false;

            setTimeout(function(){canKick = true},200)
        }
    },

});

kick.on();

var gameSettings = {
    playerSpeed: 2,
    groundSize: 50,
    groundPrerender: 100, // Number of grounds in front to render
    groundBaseColor: {red: 142 / 256.0, green: 68/256.0, blue: 173/256.0}, // Purple
    spectrumPrerender: 256, // how many of spectrums to prerender
    spectrumSpacing: 10, // space between each spectrum object
    spectrumRadius: 10, // distance from centre
    spectrumsPerRot: 16,
    fountainNum: 3,
}

// Get the canvas element from our HTML above
var canvas = document.getElementById("renderCanvas");
//var kb = new Keyboard(window);

var player;
var ground = new Array();
var spectrum = new Array();
var skybox;
var camera;
var fountain = new Array();

// Key frames for ball jump
var keys = new Array();
keys.push({ frame: 0, value: 1 });
keys.push({ frame: 10, value: 5 });
keys.push({ frame: 20, value: 1 });


var colorList = [
    [239, 72, 54],
    [219, 10, 91],
    [103, 65, 114],
    [145, 61, 136],
    [68,108,179],
    [89, 171, 227],
    [51, 110, 123],
    [58, 83, 155],
    [37, 116, 169],
    [135, 211, 124],
    [92, 151, 191],
    [135, 211, 124],
    [104, 195, 163],
    [27, 188, 155],
    [27, 163, 156],
    [77, 175, 124],
    [233,212,96],
    [235, 149, 50],
    [243, 156, 18],
    [230, 126, 34],
]

var getColor = function() {
    var c = colorList[Math.floor(Math.random() * colorList.length)];
    var color = new BABYLON.Color3(c[0]/256.0, c[1]/256.0, c[2]/256.0);
    return color;
}

// This begins the creation of a function that we will 'call' just after it's built
var createScene = function () {

    // Create babylon scene
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    // Set camera
    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 4, 12), scene);

    // Create lights
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .5;

    // Create skybox
    skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    skybox.infiniteDistance = true;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.renderingGroupId = 0;

    // Create sphere
    player = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    player.material = new BABYLON.StandardMaterial("metalTexture", scene);
    player.material.diffuseTexture = new BABYLON.Texture("textures/metal.jpg", scene);
    player.position.y = 1;
    player.renderingGroupId = 1;
    var animationBox = new BABYLON.Animation("myAnimation",
            "position.y",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    animationBox.setKeys(keys);
    var easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    animationBox.setEasingFunction(easingFunction);

    player.animations.push(animationBox);

    camera.target = player;
    camera.radius = 20;
    camera.heightOffset = 5;

    // Create ground textures
    var color = getColor();
    for (var i=0; i<gameSettings.groundPrerender; i++) {
        var ng = BABYLON.Mesh.CreateGround("ground1", 6, gameSettings.groundSize, 2, scene);
        ng.position.z = -i * gameSettings.groundSize;
        ng.material = new BABYLON.StandardMaterial("arrowTexture", scene);
        ng.material.emissiveTexture = new BABYLON.Texture("textures/arrows1.png", scene);
        ng.material.emissiveTexture.uScale = 1.0;
        ng.material.emissiveTexture.vScale = 1.0;
        ng.material.diffuseColor = color;
        ng.renderingGroupId = 1;

        ground.push(ng);
    }

    // Create spectrum analyzer
    for (var i=0; i<gameSettings.spectrumPrerender; i++) {
        var ns = BABYLON.Mesh.CreateCylinder("cylinder",
                1, // height
                3, // diam top
                3, // diam bottom
                6, // tesselation
                1, // height subdivs
                scene);
        ns.position.z = -i * gameSettings.spectrumSpacing;
        var scal_pi = 2 * (Math.PI / gameSettings.spectrumsPerRot) * i;
        ns.position.x = Math.cos(scal_pi) * gameSettings.spectrumRadius;
        ns.position.y = Math.sin(scal_pi) * gameSettings.spectrumRadius;
        ns.rotation = new BABYLON.Vector3(-Math.PI / 4, 0, scal_pi);
        ns.renderingGroupId = 1;

        ns.material = new BABYLON.StandardMaterial("spectrumTexture", scene);
        ns.material.emissiveColor = getColor();//new BABYLON.Color3(46, 204, 113);
        spectrum.push(ns);
    }

    // Create particle effects
    //
    for (var i=0; i<gameSettings.fountainNum; i++) {
        nf = BABYLON.Mesh.CreateBox("fountain", 1.0, scene);
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("textures/metal.jpg", scene);
        //particleSystem.textureMask = new BABYLON.Color4(0.1, 0.8, 0.8, 1.0);
        // Colors of all particles (splited in 2 + specific color before dispose)
        particleSystem.color1 = new BABYLON.Color4(1.0, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(1.0, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        particleSystem.emitRate = 1000;
        particleSystem.minLifeTime = 4;
        particleSystem.maxLifeTime = 8;

        particleSystem.emitter = nf;
        particleSystem.start();
        nf.position.x = 5;
        nf.position.z = -200;

        fountain.push(nf);
    }

    // Set the fog
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogDensity = 0.02;

    // Leave this function
    return scene;

};

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);
var scene = createScene();

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
        scene.beginAnimation(player, 0, 20, false);
    }
});

var spectrumAverage = function() {
    var total = 0.0;
    dancer.getSpectrum().forEach(function(num) {
        total += num;
    });
    return total / dancer.getSpectrum().length;
}

var camera_shake_frames = 0;

engine.runRenderLoop(function () {
    // Move player
    player.position.z-=gameSettings.playerSpeed;
    player.rotation.x-=0.2;

    fountain.forEach(function(f, index) {
        f.position.z -=gameSettings.playerSpeed;
        var t_val = dancer.getTime() + (2 * index / gameSettings.fountainNum) * Math.PI;
        f.position.x = 15 * Math.cos(t_val);
        f.position.y = 15 * Math.sin(t_val);
    });

    // Shift old ground tile to front
    if (player.position.z < ground[0].position.z - gameSettings.groundSize) {
        var og = ground.shift();
        og.position.z = ground[ground.length-1].position.z - gameSettings.groundSize;
        ground.push(og);
    }

    if (camera_shake_frames) {
        camera.radius = 8 + 4 * Math.random();
        camera.heightOffset = Math.random()*20;
        camera.rotationOffset = 660 + Math.random() * 120;

        // Reset camera
        if (camera_shake_frames == 1) {
            camera.radius = 20;
            camera.heightOffset = 5;
            camera.rotationOffset = 720;
        }
        camera_shake_frames--;
    }


    var specAve = spectrumAverage();
    spectrum.forEach(function(s) {
        s.scaling.y = spectrumAverage() * 300; // Scale it up
    });

    // Calculate whether to shift spectrum. We only do this every rotation
    if (spectrum[gameSettings.spectrumsPerRot + 2].position.z - player.position.z > 0) {
        for (var i=0; i<gameSettings.spectrumsPerRot; i++) {
            var last_z = spectrum[spectrum.length - 1].position.z;
            var sp = spectrum.shift();
            sp.position.z = last_z - gameSettings.spectrumSpacing;
            spectrum.push(sp);
        }
    }

    if (camera.rotationOffset < 360)
        camera.rotationOffset++;

    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

