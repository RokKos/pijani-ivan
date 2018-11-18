const kTagPhysics = "Physics";

var physicsObject = [];
const PHYSICS_DEBUG = true;

function InitPhysics() {
    //TODO: Init game parameters and settings
    DebugLog("Init Physics parameters", kTagPhysics, "InitPhysics");

    for(let i = 0; i < objects.length; i++){
        let element = objects[i];
        if (element instanceof PhysicsObject){
            physicsObject.push(element);
            DebugLog("Physics elemetn push");
        }
    }

    physicsObject[1].SetVelocity([0.1,0,0]);


}

function CalculatePhysics() {
    //TODO: Update all the game logic here
    for(let i = 0; i < physicsObject.length; i++){
        let element = physicsObject[i];
        element.PhysicsUpdate();
    }
}