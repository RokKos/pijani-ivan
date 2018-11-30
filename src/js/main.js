const kTagMain = "Main";

var PAUSE = false;

function Start() {
    // TODO: - Initiale buffers and drawing stuff
    //       - Initialize physics
    //       - Initialize game parameters
    //       - Initiale controls
    document.getElementById("Pause").checked = false;
    document.getElementById("PhysicsDebug").checked = false;
    DebugLog("Start Game", kTagMain, "Start");
    InitRender();
    InitGame();
    InitSounds();
    //InitPhysics();
    InitInput();
}

function updateObjects(){
    for(let i=0; i<objects.length; i++){
        objects[i].Update();
    }
}

function Update() {
    // TODO: - Get User input
    //       - Calculate physics
    //       - Move objects
    //          - Move enemies
    //          - Move character
    //          - Move camera
    //       - Draw stuff on screen
    PAUSE = document.getElementById("Pause").checked;
    if (PAUSE){
        return;
    }

    //DebugLog("Update call", kTagMain, "Update");
    HandleInput();
    UpdateGameParameters();
    CalculatePhysics();
    updateObjects();
    // Move objects -> Probably done from renderer
    drawScene();

    _animateFlash();
}




function main() {
    Start();

    setInterval(Update, 15);

}