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
var upS = 0;
var downS = 0;
var positionX = 0;
var positionY = 0.4;
var positionZ = 0;

// Spremenljivka casa za funkcijo animate
var lastTime = 0;
var jumping = false;

var prevX = 0;
var prevY = 0;
var prevZ = 0;

var elapsed = 0;


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

function animate() {
    var timenow = new Date().getTime();
    if(lastTime != 0) {
        elapsed = timenow - lastTime;
        
        if(positionY < 39.5 && positionY > 1.5 && jumping == true) {
            var tmpS = upS - downS;
            positionY += speed * elapsed;
            
            if(positionY > 1.5 && positionY < 2.5) {
                jumping = false;
                downS = 0;
                upS = 0;
            }
        } else if (positionY >= 39.5)
            positionY -= 0.1;
          else if(positionY < 1.5) 
            positionY += 0.1;
            
        if(speed != 0) {
            if(positionX < 19.5 && positionX > -19.5) 
                positionX -= Math.sin(degToRad(yaw)) * speed * elapsed;
            else if(positionX >= 19.5)
                positionX -= 0.2;
            else 
                positionX += 0.2;
                
            if(positionZ < 19.5 && positionZ > -19.5)
                positionZ -= Math.cos(degToRad(yaw)) * speed * elapsed;
            else if(positionZ >= 19.5)
                positionZ -= 0.2;
            else
                positionZ += 0.2;
                
        }
         yaw += yawRate * elapsed; 
            
    }
    lastTime = timenow;
    HandleInput();
    
    
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
        yawRate = 0.1;
    else if(currentlyPressedKeys[39]) //right
        yawRate = -0.1;
    else 
        yawRate = 0;
        

    if(currentlyPressedKeys[38]) //up
        speed = 0.003;
    else if(currentlyPressedKeys[40]) //down
        speed = -0.003;
    else
        speed = 0;
        
    if(currentlyPressedKeys[32]) { //space
        if(!jumping) {
            jumping = true;
        }
    } 
}

