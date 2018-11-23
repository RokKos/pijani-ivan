const kTagPhysics = "Physics";

var physicsObject = [];
var PHYSICS_DEBUG = true;

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

function InstantiateBullet() {
    let bullet = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);
    
    bullet.position = [0,0,0];
    bullet.position[0] =  cameraPosition[0];
    bullet.position[1] =  cameraPosition[1] - 0.01;
    // TODO: Make better offset
    bullet.position[2] =  cameraPosition[2] + 0.05;
    bullet.rotation = [0, 0, 0];
    bullet.scale = [0.01, 0.01, 0.1];

    let angle = cameraRotation[1];
    bullet.velocity = [0,0,0];
    bullet.velocity[0] = -Math.sin(toRadian(angle));
    bullet.velocity[2] = -Math.cos(toRadian(angle));
    
    bullet.rotation[1] = cameraRotation[1];
    bullet.SetName("Bullet_" + physicsObject.length);
    DebugLog(bullet.name + ":" +bullet.velocity, kTagPhysics, "InstantiateBullet");


    physicsObject.push(bullet);
    objects.push(bullet);
    DebugLog("Bullet instantiated", kTagPhysics, "InstantiateBullet")

}