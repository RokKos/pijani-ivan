const kTagPhysicsObject = "PhysicsObject";
var TypeOfBoxCollider = {kInterior : 0, kExeterior : 1, kLast : 2};

class PhysicsObject extends Object{
    constructor(model, _TypeOfCollider) {
            super(model);
            this.TypeOfCollider = _TypeOfCollider;
            this.velocity = [0.0, 0.0, 0.0];
            this.InCollision = false;
            this.restitution = 1 / (this.scale[0] * this.scale[1] * this.scale[2]);
            this.mass = this.scale[0] * this.scale[1] * this.scale[2];
    }



    IsInCollisionWith(other) {
        let a_minVertex = this.GetMinVertex();
        let a_maxVertex = this.GetMaxVertex();
        let b_minVertex = other.GetMinVertex();
        let b_maxVertex = other.GetMaxVertex();
        
        // This is because models get async loaded
        var isAPoint = a_minVertex[0] == 0 && a_minVertex[1] == 0 && a_minVertex[2] == 0;
        var isBPoint = b_minVertex[0] == 0 && b_minVertex[1] == 0 && b_minVertex[2] == 0;
        if (isAPoint || isBPoint) {
            return false;
        }

        if (other.TypeOfCollider == TypeOfBoxCollider.kExeterior && this.TypeOfCollider == TypeOfBoxCollider.kExeterior) {
            return true;
        }
        
        // Todo: Upostevaj collision type
        /*if (other.TypeOfCollider == TypeOfBoxCollider.kExeterior && this.TypeOfCollider == TypeOfBoxCollider.kInterior) {
            //cddwDebugLog("a: " + a_minVertex  + " " + a_maxVertex + " b " + b_minVertex  + " " + b_maxVertex);
            return (a_minVertex[0] <= b_minVertex[0] || a_maxVertex[0] >= b_maxVertex[0]) ||
                   (a_minVertex[1] <= b_minVertex[1] || a_maxVertex[1] >= b_maxVertex[1]) ||
                   (a_minVertex[2] <= b_minVertex[2] || a_maxVertex[2] >= b_maxVertex[2]);  
        }

        if (this.TypeOfCollider == TypeOfBoxCollider.kExeterior && other.TypeOfCollider == TypeOfBoxCollider.kInterior) {
            return (b_minVertex[0] <= a_minVertex[0] || b_maxVertex[0] >= a_maxVertex[0]) ||
                   (b_minVertex[1] <= a_minVertex[1] || b_maxVertex[1] >= a_maxVertex[1]) ||
                   (b_minVertex[2] <= a_minVertex[2] || b_maxVertex[2] >= a_maxVertex[2]);  
        }*/
        
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
            
            if (this instanceof BulletObject && other == CharacterBody) {
                DebugLog(this.constructor.name + " " + this.velocity, kTagPhysicsObject, "PhysicsUpdate");
                continue;
            }

            if(this != other) {
                if (this.IsInCollisionWith(other)) {
                    this.InCollision = true;
                    DebugLog("Collision " + this.name + " with " + other.name, kTagPhysicsObject, "PhysicsUpdate");
                    DebugLog("me min:" +this.GetMinVertex() + " max: " + this.GetMaxVertex());
                    DebugLog("er min:" + other.GetMinVertex() + " max: " + other.GetMaxVertex());
                    //this.velocity = [0.0,0.0,0.0];
                    this.ResolveCollision(other);
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


    ResolveCollision(other){
        DebugLog("Starting to resolve collision", kTagPhysicsObject, "ResolveCollision");
        // Calculate relative velocity
        let relativeVelocity = [0,0,0];
        relativeVelocity[0] =  other.velocity[0] - this.velocity[0];
        relativeVelocity[1] =  other.velocity[1] - this.velocity[1];
        relativeVelocity[2] =  other.velocity[2] - this.velocity[2];

        let collisionNormal = [0,0,0];

        let calculatedNormal = this.GetCollisionNormal(this, other);
        collisionNormal[0] = calculatedNormal[0];
        collisionNormal[2] = calculatedNormal[2];

    
        // Calculate relative velocity in terms of the normal direction
        let velAlongNormal = DotProduct(relativeVelocity, collisionNormal);
        
        // Do not resolve if velocities are separating
        if(velAlongNormal > 0){
            return;
        }
        
        // Calculate restitution
        let minRes = Math.min( this.restitution, other.restitution);
        
        // Calculate impulse scalar
        let impulseScalar = -(1 + minRes) * velAlongNormal;
        impulseScalar /= 1 / this.mass + 1 / other.mass;
        
        // Apply impulse
        let impulse = [impulseScalar * collisionNormal[0], impulseScalar * collisionNormal[1]];
        this.velocity[0] -= 1 / this.mass * impulse[0];
        this.velocity[2] -= 1 / this.mass * impulse[2];
        other.velocity[0] += 1 / other.mass * impulse[0];
        other.velocity[2] += 1 / other.mass * impulse[2];
    }

    // This two vector consisit of minPosition of element and its extends(width and height)
    // We will only check in X and Z cordinate
    GetCollisionNormal(objA, objB){
        

        let leftBottomA = [objA.model.minVertex[0], objA.model.minVertex[1]];
        let widthA = Math.abs(objA.model.minVertex[0] - objA.model.maxVertex[0]);
        let heightA = Math.abs(objA.model.minVertex[2] - objA.model.maxVertex[2]);
        let velXA = objA.velocity[0];
        let velZA = objA.velocity[2];

        let leftBottomB = [objB.model.minVertex[0], objB.model.minVertex[1]];
        let widthB = Math.abs(objB.model.minVertex[0] - objB.model.maxVertex[0]);
        let heightB = Math.abs(objB.model.minVertex[2] - objB.model.maxVertex[2]);

        let xInvEntry;
        let xInvExit;

        let yInvEntry;
        let yInvExit;

        // find the distance between the objects on the near and far sides for both x and y
        if (velXA > 0.0){
            xInvEntry = leftBottomB[0] - (leftBottomA[0] + widthA);
            xInvExit = (leftBottomB[0] + widthB) - leftBottomA[0];
        }
        else {
            xInvEntry = (leftBottomB[0] + widthB) - leftBottomA[0];
            xInvExit = leftBottomB[0] - (leftBottomA[0] + widthA);
        }

        if (velZA > 0.0) {
            yInvEntry = leftBottomB[1] - (leftBottomA[1] + heightA);
            yInvExit = (leftBottomB[1] + heightB) - leftBottomA[1];
        }
        else {
            yInvEntry = (leftBottomB[1] + heightB) - leftBottomA[1];
            yInvExit = leftBottomB[1] - (leftBottomA[1] + heightA);
        }

        // find time of collision and time of leaving for each axis (if statement is to prevent divide by zero)
        let xEntry;
        let yEntry;
        let xExit;
        let yExit;

        if (velXA == 0.0) {
            xEntry = -Number.MAX_SAFE_INTEGER;
            xExit = Number.MAX_SAFE_INTEGER;
        }
        else {
            xEntry = xInvEntry / velXA;
            xExit = xInvExit / velXA;
        }

        if (velZA == 0.0) {
            yEntry = -Number.MAX_SAFE_INTEGER;
            yExit = Number.MAX_SAFE_INTEGER;
        }
        else {
            yEntry = yInvEntry / velZA;
            yExit = yInvExit / velZA;
        }

        // find the earliest/latest times of collision
        let entryTime = Math.max(xEntry, yEntry);
        let exitTime = Math.min(xExit, yExit);

        // if there was no collision
        if (entryTime > exitTime || xEntry < 0.0 && yEntry < 0.0 || xEntry > 1.0 || yEntry > 1.0) {
            // return no normal
            return [0,0];
        } else {
            let normalx;
            let normalz;
            // calculate normal of collided surface
            if (xEntry > yEntry) {
                if (xInvEntry < 0.0) {
                    normalx = 1.0;
                    normalz = 0.0;
                }
                else{
                    normalx = -1.0;
                    normalz = 0.0;
                }
            }
            else {
                if (yInvEntry < 0.0) {
                    normalx = 0.0;
                    normalz = 1.0;
                }
                else {
                    normalx = 0.0;
                    normalz = -1.0;
                }
            }

            return [normalx, normalz];
        }

    }
    
}