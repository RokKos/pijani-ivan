
class Object {
    constructor(model) {
        this.model = model;
        
        this.position = [0.0, 0.0, 0.0];
        this.rotation = [0.0, 0.0, 0.0];
        this.scale = [1.0, 1.0, 1.0];
        this.mvMatrix = mat4.create();
        this.name = "Object_" + objects.length+1;
    }

    SetmvMatrix(mvMatrix) {
        this.mvMatrix = mvMatrix;
    }

    SetName(name) {
        this.name = name;
    }
  }