const kTagInput = "CharacterController";

var canvas;
var gl;
var currentlyPressedKeys = {};

//spremenljivke za hranjnenje trenutne pozicije, hitrosti in smeri kamere
var pitch = 0;
var pitchRate = 0;
var koraki = 0;
var yaw  = 0;
var yawRate = 0;
var speed = 0;
var positionX = 0;
var positionY = 0.4;
var positionZ = 0;

// Simulacija hoje -> premikamo se po sinusoidi - spremenljivka pove kot
var joggingAngle = 0;

// Spremenljivka casa za funkcijo animate
var lastTime = 0;

//Koliko casa je preteklo za funkcijo animate
var elapsed=0;


// Stopinje v radiane + normalizacija
function degToRad(degrees) {
	
	degrees=degrees % 360; // NORMALIZACIJA
	if (degrees < 0)
		degrees += 360; //NORMALIZACIJA
	
	var radiani= degrees * Math.PI / 180;
	return radiani;
	
}

function initGL(canvas){
    var gl = null;
    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = cavas.width;
        gl.viewportHeight = canvas.height;
    }catch(e) {}
    
    if(!gl) {
    alert("Unable to intialize WebGL.");
    }
    return gl;
}

//tipkovnica
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function HandleInput() {
    if(currentlyPressedKeys[33]) //page up
        positionZ -= 0.05;
    if(currentlyPressedKeys[34]) //page down
        positionZ += 0.05;
    if(currentlyPressedKeys[37]) //left
        rotationVelocityY -= 1;
    if(currentlyPressedKeys[39]) //right
        rotationVelocityY += 1;
    if(currentlyPressedKeys[38]) //up
        speed = 0.003;
    else if(currentlyPressedKeys[40]) //down
        speed = -0.003;
    else
        speed = 0;
}

function animate() {
    var timenow = new Date().getTime();
    if(lastTime != 0) {
        elapsed = timenow - lastTime;
        
        if(speed != 0) {
            
        }
    }
}