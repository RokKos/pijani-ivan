
class Object {
    constructor(model) {
        this.model = model;
        
        this.position = [0.0, 0.0, 0.0];
        this.rotation = [0.0, 0.0, 0.0];
        this.scale = [1.0, 1.0, 1.0];
        this.mvMatrix = mat4.create();;
    }

    SetmvMatrix(mvMatrix) {
        this.mvMatrix = mvMatrix;
    }
  }