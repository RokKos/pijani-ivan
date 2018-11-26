const kTagPhysics = "Physics";

var physicsObject = [];
var PHYSICS_DEBUG = true;
var THICKNES_WALLS = 0.3;

function InitPhysics() {
    //TODO: Init game parameters and settings
    DebugLog("Init Physics parameters", kTagPhysics, "InitPhysics");
    DebugLog("len objects:" + objects.length, kTagPhysics, "InitPhysics");
    for(let i = 0; i < objects.length; i++){
        let element = objects[i];
        DebugLog("element name:" + element.name, kTagPhysics, "InitPhysics");
        if (element instanceof PhysicsObject){
            physicsObject.push(element);
            DebugLog("Physics elemetn push");
        }
    }

    //physicsObject[1].SetVelocity([0.1,0,0]);


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

function ConstructExteriorPhysicsObject(object) {

    DebugLog("here");
    DebugLog(models.kocka.minVertex);
    let spodnjaPloskev = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);
    let a = Math.abs(object.model.minVertex[0] - object.model.maxVertex[0]);
    let b = Math.abs(object.model.minVertex[2] - object.model.maxVertex[2]) / 2;
    spodnjaPloskev.position = object.model.minVertex;
    spodnjaPloskev.position[0] += object.model.maxVertex[0];
    spodnjaPloskev.position[2] += object.model.maxVertex[2] / 2;
    spodnjaPloskev.position[1] -= THICKNES_WALLS * 8;
    spodnjaPloskev.scale = [a, THICKNES_WALLS, b];
    
    
    objects.push(spodnjaPloskev);

    //let zgornjaPloskev = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);
    //zgornjaPloskev.position = [8,0,8];
    //objects.push(zgornjaPloskev);
}