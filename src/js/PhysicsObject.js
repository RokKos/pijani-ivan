const kTagPhysicsObject = "PhysicsObject";
var TypeOfBoxCollider = {kInterior : 0, kExeterior : 1, kLast : 2};
var FixedDeltaTime = 1.0/15.0;  //  Because we do 15 frames per second

class PhysicsObject extends Object{
    constructor(model, _TypeOfCollider) {
        super(model);
        DebugLog(model.minVertex);
        this.TypeOfCollider = _TypeOfCollider;
        this.velocity = [0.0, 0.0, 0.0];
    }

    IsInCollisionWith(other) {
        let a_minVertex = this.GetMinVertex();
        let a_maxVertex = this.GetMaxVertex();
        let b_minVertex = other.GetMinVertex();
        let b_maxVertex = other.GetMaxVertex();
        
        var isAPoint = a_minVertex[0] == 0 && a_minVertex[1] == 0 && a_minVertex[2] == 0;
        var isBPoint = b_minVertex[0] == 0 && b_minVertex[1] == 0 && b_minVertex[2] == 0;
        if (isAPoint || isBPoint) {
            return false;
        }
        
        // Todo: Upostevaj collision type
        if (other.TypeOfCollider == TypeOfBoxCollider.kExeterior || this.TypeOfCollider == TypeOfBoxCollider.kExeterior) {
            return false;
        }
        
        return (a_minVertex[0] <= b_maxVertex[0] && a_maxVertex[0] >= b_minVertex[0]) &&
               (a_minVertex[1] <= b_maxVertex[1] && a_maxVertex[1] >= b_minVertex[1]) &&
               (a_minVertex[2] <= b_maxVertex[2] && a_maxVertex[2] >= b_minVertex[2]);
    }

    PhysicsUpdate(){
        this.position[0] += this.velocity[0] * FixedDeltaTime;
        this.position[1] += this.velocity[1] * FixedDeltaTime;
        this.position[2] += this.velocity[2] * FixedDeltaTime;

        for (let i = 0; i < physicsObject.length; ++i) {
            let other = physicsObject[i];
            if(this != other) {
                if (this.IsInCollisionWith(other)) {
                    DebugLog("Collision" + this.model.name + " with " + other.model.name, kTagPhysicsObject, "PhysicsUpdate");
                    DebugLog("me min:" +this.GetMinVertex() + " max: " + this.GetMaxVertex() + "other min:" + other.GetMinVertex() + " max: " + other.GetMaxVertex());
                    this.velocity = [0.0,0.0,0.0];
                }

            }

        }

    }

    SetVelocity(velocity) {
        this.velocity = velocity;
    }
    
    GetVelocity() {
        return this.velocity;
    }

    GetVectorInWordSpace(vector3){
        let wordCoordinates = vec3.create();
        vec3.set(vector3, wordCoordinates);
        mat4.multiplyVec3(this.mvMatrix, wordCoordinates, wordCoordinates);
        return wordCoordinates;
    }

    GetMinVertex () {
        return this.GetVectorInWordSpace(this.model.minVertex);
    }

    GetMaxVertex () {
        return this.GetVectorInWordSpace(this.model.maxVertex);
    }
    
}