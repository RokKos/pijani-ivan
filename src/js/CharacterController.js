const kTagInput = "CharacterController";

var currentlyPressedKeys = {};



var lastMouseX = 600;
var lastMouseY = 300;


function InitInput() {
    //TODO: Init user input
    DebugLog("Init User Input", kTagInput, "InitInput");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    

     document.onmousemove = handleMouseMove;
}



function handleMouseMove(event) {
  
  var newX = event.clientX;
  var newY = event.clientY;

  var deltaX = newX - lastMouseX
  var newRotationMatrix = mat4.create();
  mat4.identity(newRotationMatrix);
  mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

  var deltaY = newY - lastMouseY;
  mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

  mat4.multiply(newRotationMatrix, moonRotationMatrix, moonRotationMatrix);

  lastMouseX = newX
  lastMouseY = newY;
}

var moonRotationMatrix = mat4.create();
mat4.identity(moonRotationMatrix);

 

//tipkovnica
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function HandleInput() {
<<<<<<< HEAD
    //TODO: handle input from user
=======
    if(currentlyPressedKeys[37]) //left
        cameraPosition[0] += 0.05;
    else if(currentlyPressedKeys[39]) //right
        cameraPosition[0] -= 0.05;

    if(currentlyPressedKeys[38]) //up
        cameraPosition[2] += 0.05;
    else if(currentlyPressedKeys[40]) //down
        cameraPosition[2] -= 0.05;
    
>>>>>>> sara
}
