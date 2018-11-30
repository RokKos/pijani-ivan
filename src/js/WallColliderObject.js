const kTagWallCollider = "WallColliderObject";

class WallColliderObject extends PhysicsObject{
    constructor(model, name) {
        super(model, "WallCollider - " + name);

        this.mass = Number.MAX_SAFE_INTEGER;
    }

}