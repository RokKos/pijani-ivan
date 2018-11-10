const kTagMain = "Main";


function Start() {
    // TODO: - Initiale buffers and drawing stuff
    //       - Initialize physics
    //       - Initialize game parameters
    //       - Initiale controls
    DebugLog("Start Game", kTagMain, "Start");
    InitRender();
    InitGame();
    InitPhysics();
    InitInput();
}

function Update() {
    // TODO: - Get User input
    //       - Calculate physics
    //       - Move objects
    //          - Move enemies
    //          - Move character
    //          - Move camera
    //       - Draw stuff on screen
    DebugLog("Update call", kTagMain, "Update");
    HandleInput();
    UpdateGameParameters();
    CalculatePhysics();
    // Move objects -> Probably done from renderer
    drawScene();
    
}




function main() {
    Start();

    setInterval(Update, 15);

}