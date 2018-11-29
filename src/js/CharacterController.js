const kTagInput = "CharacterController";

var currentlyPressedKeys = {};



var lastMouseX;
var lastMouseY;

var mouseSpeed = 15;
var characterSpeed = 15;
var CharacterBody;


function InitInput() {
    //TODO: Init user input
    DebugLog("Init User Input", kTagInput, "InitInput");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousedown = InstantiateBullet;

    let plm = new PointerLockManager(canvas, handleMouseMove);
}


function characterBodyUpdate(){
    let p = CharacterBody.position;
    cameraPosition = [p[0], p[1], p[2]];
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

    if (!IsBackgroundMusicPlaying) {
        BackgroundMusic.play();
        IsBackgroundMusicPlaying = true;
    }
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function moveCharacter(forward, sideways){
    let angle = cameraRotation[1];

    let xVelocity = - forward * Math.sin(toRadian(angle))
        + sideways * Math.cos(toRadian(angle));

    let zVelocity = - forward * Math.cos(toRadian(angle))
        - sideways * Math.sin(toRadian(angle))

    CharacterBody.velocity = [xVelocity, 0, zVelocity];
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

        moveCharacter(characterSpeed * 0.1 * forward, characterSpeed * 0.1 * sideways);
    } else {
        if (CharacterBody != null) {
            //DebugLog("Stop");
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
  
  

  
var health = 100; //naj se zmanjsuje vsakič ko ga medved zadane oz ko se "zabijeta"

//if(health == 0) kliči funkcijo close
  
function close(id) {
    var el = document.getElementById(id);
    el.style.display = 'none';
    //spremeni da bo slo na FinalIndex kjer bo pisalo gameover in pa restart 
}
  