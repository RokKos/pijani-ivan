const kTagPhysicsObject = "PhysicsObject";

class PhysicsObject extends Object{
    constructor(model,name) {
            super(model, name);
            this.velocity = [0.0, 0.0, 0.0];
            this.InCollision = false;
            this.restitution = 1 / (this.scale[0] * this.scale[1] * this.scale[2]);
            this.mass = this.scale[0] * this.scale[1] * this.scale[2];
            this.collidetWith = [];  // Physics object that collidet this frame

            this.OnPhysicsUpdate = function (){};
    }



    IsInCollisionWith(other) {
        let a_minVertex = this.GetMinVertex();
        let a_maxVertex = this.GetMaxVertex();

        let aMaxVertex = [Math.max(a_minVertex[0], a_maxVertex[0]), Math.max(a_minVertex[1], a_maxVertex[1]), Math.max(a_minVertex[2], a_maxVertex[2])];
        let aMinVertex = [Math.min(a_minVertex[0], a_maxVertex[0]), Math.min(a_minVertex[1], a_maxVertex[1]), Math.min(a_minVertex[2], a_maxVertex[2])];

        let b_minVertex = other.GetMinVertex();
        let b_maxVertex = other.GetMaxVertex();

        let bMaxVertex = [Math.max(b_minVertex[0], b_maxVertex[0]), Math.max(b_minVertex[1], b_maxVertex[1]), Math.max(b_minVertex[2], b_maxVertex[2])];
        let bMinVertex = [Math.min(b_minVertex[0], b_maxVertex[0]), Math.min(b_minVertex[1], b_maxVertex[1]), Math.min(b_minVertex[2], b_maxVertex[2])];
        
        // This is because models get async loaded
        var isAPoint = a_minVertex[0] == 0 && a_minVertex[1] == 0 && a_minVertex[2] == 0;
        var isBPoint = b_minVertex[0] == 0 && b_minVertex[1] == 0 && b_minVertex[2] == 0;
        if (isAPoint || isBPoint) {
            return false;
        }
        
        return (aMinVertex[0] <= bMaxVertex[0] && aMaxVertex[0] >= bMinVertex[0]) &&
               (aMinVertex[2] <= bMaxVertex[2] && aMaxVertex[2] >= bMinVertex[2]);

    }

    PhysicsUpdate(){
        this.collidetWith = [];

        for (let i = 0; i < physicsObject.length; ++i) {
            let other = physicsObject[i];
            
            if (this instanceof BulletObject && other == CharacterBody || other instanceof BulletObject && this == CharacterBody) {
                continue;
            }

            if (this == CharacterBody) {
                resolvingCharacterCollision = false;
            }

            if(this != other) {

                /*if (other instanceof WallColliderObject && this == CharacterBody) {
                    DebugLog("me min:" + this.GetMinVertex() + " max: " + this.GetMaxVertex());
                    DebugLog(other.name + "min:" + other.GetMinVertex() + " max: " + other.GetMaxVertex()); 
                }*/

                if (this.IsInCollisionWith(other)) {
                    this.InCollision = true;
                    if (this instanceof BulletObject && other instanceof BearObject) {
                        other.loseLife();
                    }

                    if (other instanceof BearObject && this == CharacterBody) {
                        PlayerLoseLife();
                    }

                    if (other instanceof WallColliderObject && this == CharacterBody) {
                        DebugLog(other.name + "wall collision");
                    }
                    
                    // DebugLog("Collision " + this.name + " with " + other.name, kTagPhysicsObject, "PhysicsUpdate");
                    // DebugLog("me min:" + this.GetMinVertex() + " max: " + this.GetMaxVertex());
                    // DebugLog("er min:" + other.GetMinVertex() + " max: " + other.GetMaxVertex());
                    
                    if (this.velocity[0] != 0 || this.velocity[1] != 0 || this.velocity[2] != 0){
                        this.ResolveCollision(other);
                    }

                    if (this == CharacterBody) {
                        resolvingCharacterCollision = true;
                        CharacterBody.velocity[0] = Math.max(-1.5, Math.min(CharacterBody.velocity[0], 1.5));
                        CharacterBody.velocity[1] =  Math.max(-1.5, Math.min(CharacterBody.velocity[1], 1.5));
                        CharacterBody.velocity[2] =  Math.max(-1.5, Math.min(CharacterBody.velocity[2], 1.5));
                    }
                }

            }

        }

        this.position[0] += this.velocity[0] * FixedDeltaTime;
        this.position[1] += this.velocity[1] * FixedDeltaTime;
        this.position[2] += this.velocity[2] * FixedDeltaTime;

        this.OnPhysicsUpdate();
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
        mat4.multiplyVec3(this.mMatrix, wordCoordinates, wordCoordinates);
        return wordCoordinates;
    }

    GetMinVertex () {
        return this.GetVectorInWordSpace(this.model.minVertex);
    }

    GetMaxVertex () {
        return this.GetVectorInWordSpace(this.model.maxVertex);
    }

    GetWidth(){
        return Math.abs(this.model.minVertex[0] - this.model.maxVertex[0]) * this.scale[0];
    }

    GetHeight(){
        return Math.abs(this.model.minVertex[1] - this.model.maxVertex[1]) * this.scale[1];
    }

    GetDepth(){
        return Math.abs(this.model.minVertex[2] - this.model.maxVertex[2]) * this.scale[2];
    }


    ResolveCollision(other){
        DebugLog("Starting to resolve collision", kTagPhysicsObject, "ResolveCollision");
        // Calculate relative velocity
        let relativeVelocity = [0,0,0];
        relativeVelocity[0] =  other.velocity[0] - this.velocity[0];
        relativeVelocity[1] =  other.velocity[1] - this.velocity[1];
        relativeVelocity[2] =  other.velocity[2] - this.velocity[2];

        /*if (other instanceof WallColliderObject) {
            relativeVelocity[0] *= -1;
            relativeVelocity[1] *= -1;
            relativeVelocity[2] *= -1;
        }*/

        let collisionNormal = [0,0,0];

        let calculatedNormal = this.GetCollisionNormal(this, other);
        collisionNormal[0] = calculatedNormal[0];
        collisionNormal[2] = calculatedNormal[1];
        DebugLog("Collision normal: " + collisionNormal, kTagPhysicsObject, "ResolveCollision");

        DebugLog("Relative velocity: " + relativeVelocity, kTagPhysicsObject, "ResolveCollision");
        // Calculate relative velocity in terms of the normal direction
        let velAlongNormal = DotProduct(relativeVelocity, collisionNormal);
        
        // Do not resolve if velocities are separating
        if(velAlongNormal > 0){
            DebugLog(this.name + " -- " + other.name);
            return;
        }
        DebugLog("velAlongNormal: " + velAlongNormal, kTagPhysicsObject, "ResolveCollision");
        // Calculate restitution
        let minRes = Math.min( this.restitution, other.restitution);
        
        // Calculate impulse scalar
        let impulseScalar = -(1 + minRes) * velAlongNormal;
        impulseScalar /= 1 / this.mass + 1 / other.mass;
        DebugLog("Impulse scalar: " + impulseScalar, kTagPhysicsObject, "ResolveCollision");
        // Apply impulse
        let impulse = [impulseScalar * collisionNormal[0], impulseScalar * collisionNormal[2]];
        DebugLog("Impulse vector: " + impulse, kTagPhysicsObject, "ResolveCollision");
        
        if (impulse[0] != 0) {
            DebugLog("this mass: " + this.mass, kTagPhysicsObject, "ResolveCollision");
            DebugLog("Change this: " + this.mass * impulse[0], kTagPhysicsObject, "ResolveCollision");
            DebugLog("other mass: " + other.mass, kTagPhysicsObject, "ResolveCollision");
            DebugLog("Change other: " + other.mass * impulse[0], kTagPhysicsObject, "ResolveCollision");
            this.velocity[0] -= 1 / this.mass * impulse[0];
            other.velocity[0] += 1 / other.mass * impulse[0];
        }

        if (impulse[1] != 0) {
            this.velocity[2] -= 1 / this.mass * impulse[1];
            other.velocity[2] += 1 / other.mass * impulse[1];
        }
        
        DebugLog("Me velocity" + this.velocity, kTagPhysicsObject, "ResolveCollision");
        DebugLog("Other velocity" + other.velocity, kTagPhysicsObject, "ResolveCollision");
    }

    // This two vector consisit of minPosition of element and its extends(width and height)
    // We will only check in X and Z cordinate
    GetCollisionNormal(objA, objB){
        let minVertexA = [objA.position[0], objA.position[2]]; //objA.GetMinVertex();
        let minVertexB = [objB.position[0], objB.position[2]];//objB.GetMinVertex();

        let leftBottomA = minVertexA; //[minVertexA[0], minVertexA[2]];
        let widthA = objA.GetWidth();//Math.abs(objA.model.minVertex[0] - objA.model.maxVertex[0]);
        let heightA = objA.GetDepth();//Math.abs(objA.model.minVertex[2] - objA.model.maxVertex[2]);
        let velXA = objA.velocity[0];
        let velZA = objA.velocity[2];
        //DebugLog("objA: " + objA.velocity + " objB: " + objB.velocity, kTagPhysicsObject, "GetCollisionNormal");

        let leftBottomB = minVertexB; //[minVertexB[0], minVertexB[2]];
        let widthB = objB.GetWidth();// Math.abs(objB.model.minVertex[0] - objB.model.maxVertex[0]);
        let heightB = objB.GetDepth();// Math.abs(objB.model.minVertex[2] - objB.model.maxVertex[2]);

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
        if (false){//entryTime > exitTime){// || xEntry < 0.0 && yEntry < 0.0 || xEntry > 1.0 || yEntry > 1.0) {
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