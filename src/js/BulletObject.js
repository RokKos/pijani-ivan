const kTagBullet = "BulletObject";

class BulletObject extends PhysicsObject{
    constructor(model, _TypeOfCollider) {
        super(model, _TypeOfCollider);

        this.position = [0,0,0];
        this.position[0] =  cameraPosition[0];
        this.position[1] =  cameraPosition[1] - 0.01;
        // TODO: Make better offset
        this.position[2] =  cameraPosition[2] + 0.05;
        this.rotation = [0, 0, 0];
        this.scale = [0.01, 0.01, 0.1];
    
        let angle = cameraRotation[1];
        this.velocity = [0,0,0];
        this.velocity[0] = -Math.sin(toRadian(angle));
        this.velocity[2] = -Math.cos(toRadian(angle));
        
        this.rotation[1] = cameraRotation[1];
        this.SetName("Bullet_" + physicsObject.length);
        DebugLog(this.name + ":" +this.velocity, kTagPhysics, "InstantiateBullet");

        this.timeOfLife = 100.0;
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