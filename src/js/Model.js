
class Model {
    constructor() {
        this.verticesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();
        this.facesBuffer = gl.createBuffer();
    }

    _bindBuffer(buffer, values, item_size){
        console.log(values.length);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
        buffer.itemSize = item_size;
        buffer.numItems = Math.floor(values.length/item_size);
    }

    _bindElementBuffer(buffer, values){
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(values), gl.STATIC_DRAW);
        buffer.itemSize = 1;
        buffer.numItems = values.length;
    }

    setVertices(vertices){
        this._bindBuffer(this.verticesBuffer, vertices, 3);
    }

    setNormals(normals){
        this._bindBuffer(this.normalsBuffer, normals, 3);
    }

    setFaces(faces){
        this._bindElementBuffer(this.facesBuffer, faces);
    }

    // Reads model from file
    static fromFile(file){
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);

        let model = new Model();

        rawFile.onreadystatechange = function() {
            if(rawFile.readyState === 4) {
                if(rawFile.status === 200 || rawFile.status == 0) {

                    let allVertices = [];
                    let allFaces = [];
                    let allNormals = [];

                    let readVertices = [];
                    let readNormals = [];
                    let readFaces = [];
                    
                    let allText = rawFile.responseText;
                    let elements = allText.replace(/\n/g, " ").split(/\s+/);
                
                    for (let i = 0; i < elements.length; i+=4) {

                        // Parse vertex
                        if ("v".localeCompare(elements[i]) == 0){
                            for (let j = 1; j < 4; ++j) {
                                readVertices.push(parseFloat(elements[i+j]));
                            }
                        } 
                        // Parse face
                        else if ("f".localeCompare(elements[i]) == 0) {
                            for (let j = 1; j < 4; ++j) {
                                var face_components = elements[i+j].split("//");
                                let vertex = parseInt(face_components[0]) - 1;
                                let normal = parseInt(face_components[1]) - 1;
                                readFaces.push([vertex, normal]);
                            }
                        
                        }
                        // Parse normal
                        else if ("vn".localeCompare(elements[i]) == 0) {
                            for (let j = 1; j < 4; ++j) {
                                readNormals.push(parseFloat(elements[i+j]));
                            }
                        }else {
                            i -= 3;
                        }

                    }



                    let faceMap = new Map();
                    let faceMapCount = 0;
                    // Go through faces and populate allVertices, allNormals, allFaces
                    for (let i=0; i<readFaces.length; i++){
                        let faceVN = readFaces[i];
                        let fVertex = faceVN[0];
                        let fNormal = faceVN[1];

                        // if (vertex, normal) pair not in map, then add to map
                        if (!faceMap.has(faceVN)){
                            faceMap.set(faceVN, faceMapCount);
                            faceMapCount += 1;

                            for (let j=0; j<3; j++){
                                allVertices.push(readVertices[3*fVertex+j]);
                                allNormals.push(readNormals[3*fNormal+j]);
                            }
                        }

                        allFaces.push(faceMap.get(faceVN));
                    }

                    // Assign geometry to model
                    model.setVertices(allVertices);
                    model.setFaces(allFaces);
                    model.setNormals(allNormals);
                
                }
            }
        }
        rawFile.send(null);

        return model;
    }
}