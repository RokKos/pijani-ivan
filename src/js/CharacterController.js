const kTagInput = "CharacterController";

function InitInput() {
    //TODO: Init user input
    DebugLog("Init User Input", kTagInput, "InitInput");
}

var currentlyPressedKeys = {};


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
        rotationVelocityX -= 1;
    if(currentlyPressedKeys[40]) //down
        rotationVelocityX += 1;
}