const kTagModel = "Model";
class Model {
    constructor(name) {
        this.name = name;
        this.verticesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.facesBuffer = gl.createBuffer();
        // Physics
        this.baricentricBuffer = gl.createBuffer();
        this.boundingBoxBufferVertex = gl.createBuffer();
        this.boundingBoxBufferfacesBuffer = gl.createBuffer();
        this.minVertex = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
        this.maxVertex = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    }

    _bindBuffer(buffer, values, item_size){
        DebugLog(values.length, kTagModel, "_bindBuffer");
        DebugLog(values, kTagModel, "_bindBuffer");
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

    setColors(colors){
        this._bindBuffer(this.colorsBuffer, colors, 3);
    }

    setBaricentric(baricentric){
        this._bindBuffer(this.baricentricBuffer, baricentric, 3);
    }

    setBoundingBox(boundingBox){
        this._bindBuffer(this.boundingBoxBufferVertex, boundingBox, 3);
    }

    setFaces(faces){
        this._bindElementBuffer(this.facesBuffer, faces);
    }
    
    setBoundingBoxFaces(faces){
        this._bindElementBuffer(this.boundingBoxBufferfacesBuffer, faces);
    }

    static parseObj(content){
        let allVertices = [];
        let allFaces = [];
        let allNormals = [];

        let readVertices = [];
        let readNormals = [];
        let readFaces = [];
        
        let allText = content;
        let elements = allText.replace(/\n/g, " ").split(/\s+/);
    
        for (let i = 0; i < elements.length; i+=4) {

            // Parse vertex
            if ("v".localeCompare(elements[i]) == 0){
                for (let j = 1; j < 4; ++j) {
                    let vert = parseFloat(elements[i+j]);
                    readVertices.push(vert);
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

        let data = {
            vertices: allVertices,
            normals: allNormals,
            faces: allFaces,
            colors: []
        };

        return data;
    }

    static parseJSON(content){
        let data = JSON.parse(content);
        return data;
    }

    // Reads model from file
    static fromFile(file, type){
        type = type || "obj";
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);

        let model = new Model(file);

        rawFile.onreadystatechange = function() {
            if(rawFile.readyState === 4) {
                if(rawFile.status === 200 || rawFile.status == 0) {

                    // Parse data
                    let data = {};
                    if(type == "obj"){
                        data = Model.parseObj(rawFile.responseText);
                    }
                    else if (type == "json"){
                        data = Model.parseJSON(rawFile.responseText);
                    }

                    console.log("DATA", type, data);

                    // Set color to white if empty
                    if(data.colors.length == 0){
                        for (let i=0; i<data.vertices.length; i++){
                            data.colors.push(1.0);
                        }
                    }

                    // Physics
                    let allBaricenters = [];
                    let baricenterVectors = [[1.0,0.0,0.0], [0.0,1.0,0.0], [0.0,0.0,1.0]];
                    let currBaricenterVector = 0;

                    for (let i=0; i<data.vertices.length; i++){
                        for (let j=0; j<3; j++) {
                            let vert = data.vertices[3*i+j];
                            // Physics purpose
                            if (model.minVertex[j] > vert) {
                                model.minVertex[j] = vert;
                            }

                            if (model.maxVertex[j] < vert) {
                                model.maxVertex[j] = vert;
                            }
                            allBaricenters.push(baricenterVectors[currBaricenterVector][j]);
                        }
                        currBaricenterVector += 1;
                        currBaricenterVector %= 3;
                    }

                    
                    
                    // Assign geometry to model
                    model.setVertices(data.vertices);
                    model.setFaces(data.faces);
                    model.setNormals(data.normals);
                    model.setColors(data.colors);
                    
                    // Physics
                    model.setBaricentric(allBaricenters);
                    let allBoundingBoxVertices = [];
                    for (var i = 0; i < 8; ++i) {
                        let binary = i.toString(2).pad(3);
                        DebugLog(binary, kTagModel, "fromFile");
                        for (var j = 0; j < 3; ++j) {
                            if (binary.charAt(j)=="0") {
                                allBoundingBoxVertices.push(model.minVertex[j]);
                            } else {
                                allBoundingBoxVertices.push(model.maxVertex[j]);
                            }

                        }
                    }
                    DebugLog(allBoundingBoxVertices, kTagModel, "fromFile");
                    model.setBoundingBox(allBoundingBoxVertices);
                   
                    let allBoundingBoxFaces =[1,2,0, 3,6,2, 
                                                7,4,6, 5,0,4,
                                                6,0,2, 3,5,7,
                                                1,3,2, 3,7,6,
                                                7,5,4, 5,1,0,
                                                6,4,0, 3,1,5];
                    
                    DebugLog(allBoundingBoxFaces, kTagModel, "fromFile");
                    model.setBoundingBoxFaces(allBoundingBoxFaces);
                }
            }
        }
        rawFile.send(null);

        return model;
    }
}

// This adds leading zeros to the front of the string
String.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }