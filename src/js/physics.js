
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
    let bullet = new BulletObject(models.bullet);

    physicsObject.push(bullet);
    DebugLog(objects.length);
    objects.push(bullet);
    DebugLog(bullet.name + " instantiated", kTagPhysics, "InstantiateBullet")
    DebugLog(objects.length);

    GunShotSound.play();
    startFlashAnimation();
}

function ConstructExteriorPhysicsObject(obj, parent, minVertex, maxVertex) {

    DebugLog("min vertex: " + minVertex, kTagPhysics, "ConstructExteriorPhysicsObject");
    DebugLog("max vertex: " + maxVertex, kTagPhysics, "ConstructExteriorPhysicsObject");

    let width = Math.abs(maxVertex[0] - minVertex[0]);
    let height = Math.abs(maxVertex[1] - minVertex[1]);
    let depth = Math.abs(maxVertex[2] - minVertex[2]);

    let kockaWidth = Math.abs(models.kocka.maxVertex[0] - models.kocka.minVertex[0]);
    let kockaHeight = Math.abs(models.kocka.maxVertex[1] - models.kocka.minVertex[1]);
    let kockaDepth = Math.abs(models.kocka.maxVertex[2] - models.kocka.minVertex[2]);

    let scaleX = width / kockaWidth;
    let scaleY = height / kockaHeight;
    let scaleZ = depth / kockaDepth;

    obj.scale = [1,1,1];
    // Initial position and scale
    obj.rotation = [0,0,0];
    obj.rotation[0] = parent.rotation[0];
    obj.rotation[1] = parent.rotation[1];
    obj.rotation[2] = parent.rotation[2];
    // Set to center of bounding box
    obj.position = [0,0,0];
    // offset for parent
    obj.position[0] = parent.position[0];
    obj.position[1] = parent.position[1];
    obj.position[2] = parent.position[2];
    SetmMatrix(obj);
    

    // Put on right place where collider should be
    obj.position[0] = minVertex[0];
    obj.position[1] = minVertex[1];
    obj.position[2] = minVertex[2];

    obj.position[0] += width / 2;
    obj.position[1] += height / 2;
    obj.position[2] += depth / 2;

    obj.scale = [scaleX, scaleY, scaleZ];
    
    let colliderOffsetMatrix = mat4.create();
    mat4.identity(colliderOffsetMatrix);
    mat4.translate(colliderOffsetMatrix, obj.position);
    mat4.scale(colliderOffsetMatrix, obj.scale);
    mat4.multiply(mMatrix, colliderOffsetMatrix, mMatrix);

    obj.SetmMatrix(mMatrix);

    
    DebugLog(obj.name + " SCALE: " + obj.scale, kTagPhysics, "ConstructExteriorPhysicsObject");
    DebugLog(obj.name + " pos: " + obj.position, kTagPhysics, "ConstructExteriorPhysicsObject");
    objects.push(obj);
}

function DotProduct(a,b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}