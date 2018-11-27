const kTagBear = "BearObject";

class BearObject extends PhysicsObject{
    constructor(model, _TypeOfCollider) {
        super(model, _TypeOfCollider);
        this.life = 3;
    }

    PhysicsUpdate(){
        super.PhysicsUpdate();

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
        if (this.life <= 0) {
            DebugLog("Destroyed by bullets : " + this.name, kTagBear, "PhysicsUpdate");
            this.Destroy();
        }

    }

}