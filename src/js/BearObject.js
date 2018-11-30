const kTagBear = "BearObject";

class BearObject extends PhysicsObject{
    constructor(model, _TypeOfCollider) {
        super(model, _TypeOfCollider);
        this.life = 3;
        this.speed = 10.0;
        this.wakeUpDistance = 32.0;
        this.wokenUp = false;
    }

    PhysicsUpdate(){
        super.PhysicsUpdate();


        let playerPosition = cameraPosition;
        
        let toPlayer = [playerPosition[0]-this.position[0],
                            playerPosition[2]-this.position[2]];

        let distance = Math.sqrt(toPlayer[0]*toPlayer[0]+toPlayer[1]*toPlayer[1]);

        if (this.wokenUp){
            let toPlayerNormalized = [toPlayer[0]/distance, toPlayer[1]/distance];

            if (distance > 5.0){
                this.velocity[0] = this.speed * 0.1 * toPlayerNormalized[0];
                this.velocity[2] = this.speed * 0.1 * toPlayerNormalized[1];
            } else {
                this.velocity[0] = 0;
                this.velocity[2] = 0;
            }
            
            let angle = Math.atan2(toPlayerNormalized[1], toPlayerNormalized[0]);
            this.rotation[1] = - angle / Math.PI * 180.0 + 90.0;
        } else {
            if(distance < this.wakeUpDistance){
                this.wokenUp = true;
                BearSound.play();
            }
        }
    }

    Destroy(){
        let index = objects.indexOf(this);
        objects.splice(index, 1);
        index = physicsObject.indexOf(this);
        physicsObject.splice(index, 1);
        delete this;

    }

    loseLife() {
        
        this.life -= 1;
        DebugLog("Bear LOSE LIFE" + this.life);
        if (this.life <= 0) {
            DebugLog("Destroyed by bullets : " + this.name, kTagBear, "PhysicsUpdate");
            this.Destroy();
        }

    }

}