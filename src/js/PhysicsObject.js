const kTagPhysicsObject = "PhysicsObject";
var TypeOfBoxCollider = {kInterior : 0, kExeterior : 1, kLast : 2};
var FixedDeltaTime = 1.0/15.0;  //  Because we do 15 frames per second


class PhysicsObject extends Object{
    constructor(model, _TypeOfCollider) {
        super(model);
        this.TypeOfCollider = _TypeOfCollider;
        this.velocity = [0.0, 0.0, 0.0];
    }

    IsInCollisionWith(other) {
        let a = this.model;
        let b = other.model;
        // Todo: Upostevaj collision type
        return (a.minVertex[0] <= b.maxVertex[0] && a.maxVertex[0] >= b.minVertex[0]) &&
               (a.minVertex[1] <= b.maxVertex[1] && a.maxVertex[1] >= b.minVertex[1]) &&
               (a.minVertex[2] <= b.maxVertex[2] && a.maxVertex[2] >= b.minVertex[2]);
    }

    PhysicsUpdate(){
        this.position[0] += this.velocity[0] * FixedDeltaTime;
        this.position[1] += this.velocity[1] * FixedDeltaTime;
        this.position[2] += this.velocity[2] * FixedDeltaTime;

    }

    SetVelocity(velocity) {
        this.velocity = velocity;
    }
    
    GetVelocity() {
        return this.velocity;
    }
    
}