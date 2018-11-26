const kTagInput = "CharacterController";

var currentlyPressedKeys = {};



var lastMouseX;
var lastMouseY;

var mouseSpeed = 15;
var characterSpeed = 10;
var CharacterBody;


function InitInput() {
    //TODO: Init user input
    DebugLog("Init User Input", kTagInput, "InitInput");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousedown = InstantiateBullet;

    let plm = new PointerLockManager(canvas, handleMouseMove);
}



function handleMouseMove(event) {
  let deltaX = event.movementX;
  let deltaY = event.movementY;

  cameraRotation[1] -= deltaX * mouseSpeed * 0.01;
  cameraRotation[0] -= deltaY * mouseSpeed * 0.01;
  
  // clamp between -90, 90
  cameraRotation[0] = Math.min(Math.max(-90, cameraRotation[0]), 90);
}

function toRadian(degrees){
    return (degrees/180.0) * Math.PI;
}

//tipkovnica
function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function moveCharacter(forward, sideways){
    let angle = cameraRotation[1];

    cameraPosition[0] -= forward * Math.sin(toRadian(angle));
    cameraPosition[2] -= forward * Math.cos(toRadian(angle));

    cameraPosition[0] -= - sideways * Math.cos(toRadian(angle));
    cameraPosition[2] -= sideways * Math.sin(toRadian(angle));

    
    // TODO FIX THIS

    CharacterBody.position = [cameraPosition[0], CharacterBody.position[1], cameraPosition[2]];
    DebugLog("Character velocity: " + CharacterBody.velocity);

}

function HandleInput() {
    let sideways = 0.0;
    let forward = 0.0;

    if(currentlyPressedKeys[65]) //left
        sideways = -1.0
    else if(currentlyPressedKeys[68]) //right
        sideways = 1.0

    if(currentlyPressedKeys[87]) //up
        forward = 1.0
    else if(currentlyPressedKeys[83]) //down
        forward = -1.0

    if (sideways != 0.0 || forward != 0.0){
        let length = Math.sqrt(sideways*sideways+forward*forward);
        sideways /= length;
        forward /= length;

        moveCharacter(characterSpeed * 0.01 * forward, characterSpeed * 0.01 * sideways);
    } else {
        if (CharacterBody != null) {
            DebugLog("Stop");
            CharacterBody.SetVelocity([0,0,0]);
        }

    }

    // Physics Debug
    PHYSICS_DEBUG = document.getElementById("PhysicsDebug").checked;
}

class PointerLockManager {

    constructor(elem, moveCallback) {
      this.elem = elem || document.body;
      this.moveCallback = moveCallback || function(e) {};
      this.elem.addEventListener('click', this.lock.bind(this));
  
      document.addEventListener('pointerlockchange', this.onChangeHandler.bind(this));
    }
  
    isLocked() {
      return document.pointerLockElement === this.elem;
    }
  
    lock() {
      if(!this.isLocked()){
        this.elem.requestPointerLock();
        document.addEventListener("mousemove", this.moveCallback, false);
      }
    }
  
    unlock() {
      if(this.isLocked()){
        document.removeEventListener("mousemove", this.moveCallback, false);
        document.exitPointerLock();
      }
    }
  
    onChangeHandler() {
    //   console.log('pointer is '+(this.isLocked() ? 'locked' : 'unlocked'));
    }
  }
  
