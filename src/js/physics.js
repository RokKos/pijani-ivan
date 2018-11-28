
const kTagPhysics = "Physics";

var physicsObject = [];
var PHYSICS_DEBUG = false;
var THICKNES_WALLS = 0.1;
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

    let spodnjaPloskev = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);

    let minVertex = object.GetMinVertex();
    let maxVertex = object.GetMaxVertex()

    DebugLog("min vertex: " + minVertex, kTagPhysics, "ConstructExteriorPhysicsObject");
    DebugLog("max vertex: " + maxVertex, kTagPhysics, "ConstructExteriorPhysicsObject");

    let width = Math.abs(maxVertex[0] - minVertex[0]);
    let height = Math.abs(maxVertex[1] - minVertex[1]);
    let depth = Math.abs(maxVertex[2] - minVertex[2]);

    DebugLog("spodnja ploskev width: " + width, kTagPhysics, "ConstructExteriorPhysicsObject");

    let kockaWidth = Math.abs(models.kocka.maxVertex[0] - models.kocka.minVertex[0]);
    let kockaHeight = Math.abs(models.kocka.maxVertex[1] - models.kocka.minVertex[1]);
    let kockaDepth = Math.abs(models.kocka.maxVertex[2] - models.kocka.minVertex[2]);

    DebugLog("kocka width: " + kockaWidth, kTagPhysics, "ConstructExteriorPhysicsObject");

    let scaleX = width / kockaWidth;
    let scaleY = height / kockaHeight;
    let scaleZ = depth / kockaDepth;


    // Initial position and scale
    spodnjaPloskev.scale = [scaleZ * 1, THICKNES_WALLS, scaleZ * 1];
    spodnjaPloskev.position = minVertex;
    spodnjaPloskev.position[0] += width / 2;
    spodnjaPloskev.position[2] += depth / 2;
    SetmMatrix(spodnjaPloskev);
    spodnjaPloskev.SetmMatrix(mMatrix);
    
    
    spodnjaPloskev.position[1] -= (height + THICKNES_WALLS * 2);
    
    DebugLog("spodnja ploskev SCALE: " + spodnjaPloskev.scale, kTagPhysics, "ConstructExteriorPhysicsObject");
    DebugLog("spodnja ploskev pos: " + spodnjaPloskev.position, kTagPhysics, "ConstructExteriorPhysicsObject");

    DebugLog("obj pos: " + object.position, kTagPhysics, "ConstructExteriorPhysicsObject");
    objects.push(spodnjaPloskev);

    //let zgornjaPloskev = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);
    //zgornjaPloskev.position = [8,0,8];
    //objects.push(zgornjaPloskev);
}

function DotProduct(a,b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}