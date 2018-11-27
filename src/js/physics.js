
const kTagPhysics = "Physics";

var physicsObject = [];
var PHYSICS_DEBUG = true;
var THICKNES_WALLS = 0.3;
var FixedDeltaTime = 1.0/15.0;  //  Because we do 15 frames per second

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
    let bullet = new BulletObject(models.kocka, TypeOfBoxCollider.kInterior);

    physicsObject.push(bullet);
    DebugLog(objects.length);
    objects.push(bullet);
    DebugLog(bullet.name + " instantiated", kTagPhysics, "InstantiateBullet")
    DebugLog(objects.length);

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

function DotProduct(a,b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}