const kTagBullet = "BulletObject";

class BulletObject extends PhysicsObject{
    constructor(model) {
        super(model, "Bullet_" + physicsObject.length);

        let bulletSpeed = 7.0;

        this.position = [0,0,0];
        this.position[0] =  CharacterBody.position[0];
        this.position[1] =  CharacterBody.position[1] - 0.2;
        // TODO: Make better offset
        this.position[2] =  CharacterBody.position[2];
        this.rotation = [0, 0, 0];
        this.scale = [0.1, 0.1, 0.1];
    
        let angle = cameraRotation[1];
        this.velocity = [0,0,0];
        this.velocity[0] = -bulletSpeed * Math.sin(toRadian(angle));
        this.velocity[2] = -bulletSpeed * Math.cos(toRadian(angle));
        
        this.rotation[1] = cameraRotation[1];
        DebugLog(this.name + ":" +this.velocity, kTagPhysics, "InstantiateBullet");

        this.timeOfLife = 20.0;
        this.mass = 100;
    }

    PhysicsUpdate(){
        super.PhysicsUpdate();

        if (this.InCollision){
            DebugLog("Destroyed by collision : " + this.name, kTagBullet, "PhysicsUpdate");
            this.DestroyBullet();
            return;
        }

        this.timeOfLife -= FixedDeltaTime;
        if (this.timeOfLife < 0) {
            DebugLog("Destroyed by time :" + this.name, kTagBullet, "PhysicsUpdate");
            this.DestroyBullet();
            return;
        }
    }

    DestroyBullet(){
        let index = objects.indexOf(this);
        objects.splice(index, 1);
        index = physicsObject.indexOf(this);
        physicsObject.splice(index, 1);
        delete this;

    }

}