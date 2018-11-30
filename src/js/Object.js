
class Object {
    constructor(model) {
        this.model = model;
        this.scale = [1.0, 1.0, 1.0];
        

        this.position = [0.0,0.0,0.0];
        this.rotation = [0.0, 0.0, 0.0];
        
        this.mMatrix = mat4.create();
        this.name = "Object_" + objects.length+1;
    }

    SetmMatrix(mMatrix) {
        this.mMatrix = mMatrix;
    }

    SetName(name) {
        this.name = name;
    }

    SetPosition(pos) {
        this.position[0] += pos[0];
        this.position[1] += pos[1];
        this.position[2] += pos[2];
    }

    GetPosition (){
        return this.position;

    }


    GetCenterOfModel() {
        let centerX = (this.model.maxVertex[0] - this.model.minVertex[0]) * this.scale[0];
        let centerY = (this.model.maxVertex[1] - this.model.minVertex[1]) * this.scale[1];
        let centerZ = (this.model.maxVertex[2] - this.model.minVertex[2]) * this.scale[2];
        return [centerX, centerY, centerZ];
    }
    
    Update(){
        
    }
  }