const kTagModel = "Model";
class Model {
    constructor() {
        this.verticesBuffer = gl.createBuffer();
        this.normalsBuffer = gl.createBuffer();
        this.facesBuffer = gl.createBuffer();
        // Physics
        this.baricentricBuffer = gl.createBuffer();
        this.boundingBoxBufferVertex = gl.createBuffer();
        this.boundingBoxBufferfacesBuffer = gl.createBuffer();
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
                    let allBaricenters = [];
                    let baricenterVectors = [[1.0,0.0,0.0], [0.0,1.0,0.0], [0.0,0.0,1.0]];
                    let currBaricenterVector = 0;
                    let minVertex = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
                    let maxVertex = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

                    let tempNormals = [];
                    let vert2normal = {};
                    let allText = rawFile.responseText;
                    let elements = allText.replace(/\n/g, " ").split(" ");
                
                    for (let i = 0; i < elements.length; i+=4) {

                        // Parse vertex
                        if ("v".localeCompare(elements[i]) == 0){
                            for (let j = 1; j < 4; ++j) {
                                let vert = parseFloat(elements[i+j]);
                                allVertices.push(vert);

                                // Physics purpose
                                if (minVertex[j-1] > vert) {
                                    minVertex[j-1] = vert;
                                }

                                if (maxVertex[j-1] < vert) {
                                    maxVertex[j-1] = vert;
                                }
                                allBaricenters.push(baricenterVectors[currBaricenterVector][j-1]);
                            }
                            currBaricenterVector += 1;
                            currBaricenterVector %= 3;
                        } 
                        // Parse face
                        else if ("f".localeCompare(elements[i]) == 0) {
                            for (let j = 1; j < 4; ++j) {
                                var face_components = elements[i+j].split("//");
                                //DebugLog(face_components[0] + " " + face_components[1], kTagRender, "ImportObjectFile");
                                let vertex = parseInt(face_components[0]) - 1;
                                let normal = parseInt(face_components[1]) - 1;
                                vert2normal[vertex] = normal;

                                allFaces.push(vertex);
                            }
                        
                        }
                        // Parse normal
                        else if ("vn".localeCompare(elements[i]) == 0) {
                            for (let j = 1; j < 4; ++j) {
                                tempNormals.push(parseFloat(elements[i+j]));
                            }
                        }else {
                            i -= 3;
                        }

                    }

                    // Number of normals may be smaller than the number of vertices
                    // Here we get the normal for each vertex, so the sizes match
                    // (needed for WebGL)
                    for (let k=0; k< allVertices.length/3; k++) {
                        let ix = vert2normal[k];
                        for (let j=0; j<3; j++){
                          if(ix !== undefined){
                            allNormals[3*k+j] = tempNormals[3*ix+j];
                          } else {
                            allNormals[3*k+j] = 0.0;
                          }
                        }
                    }

                    // console.log(allVertices, allNormals, allFaces);

                    // Assign geometry to model
                    model.setVertices(allVertices);
                    model.setFaces(allFaces);
                    model.setNormals(allNormals);
                    
                    // Physics
                    model.setBaricentric(allBaricenters);
                    let allBoundingBoxVertices = [];
                    for (var i = 0; i < 8; ++i) {
                        let binary = i.toString(2).pad(3);
                        DebugLog(binary, kTagModel, "fromFile");
                        for (var j = 0; j < 3; ++j) {
                            if (binary.charAt(j)=="0") {
                                allBoundingBoxVertices.push(minVertex[j]);
                            } else {
                                allBoundingBoxVertices.push(maxVertex[j]);
                            }

                        }
                    }
                    DebugLog(allBoundingBoxVertices, kTagModel, "fromFile");
                    model.setBoundingBox(allBoundingBoxVertices);

                    /*let allBoundingBoxFaces = [0,1,2,  0,2,3,
                                               0,4,2,  0,2,6,
                                               0,4,1,  0,1,5,
                                               4,5,6,  4,6,7,
                                               1,5,3,  1,3,7,
                                               2,6,3,  2,3,7 
                                              ];
                    */
                   
                   let allBoundingBoxFaces =[2 - 1,
                   3 - 1,
                   1 - 1,
                   4 - 1,
                   7 - 1,
                   3 - 1,
                   8 - 1,
                   5 - 1,
                   7 - 1,
                   6 - 1,
                   1 - 1,
                   5 - 1,
                   7 - 1,
                   1 - 1,
                   3 - 1,
                   4 - 1,
                   6 - 1,
                   8 - 1,
                   2 - 1,
                   4 - 1,
                   3 - 1,
                   4 - 1,
                   8 - 1,
                   7 - 1,
                   8 - 1,
                   6 - 1,
                   5 - 1,
                   6 - 1,
                   2 - 1,
                   1 - 1,
                   7 - 1,
                   5 - 1,
                   1 - 1,
                   4 - 1,
                   2 - 1,
                   6 -1];
                    
                    /*for (var i = 0; i < 36; i+=4) {
                        for(var j = 0; j < 4; ++j) {
                            allBoundingBoxFaces.push(i+(j % 3));
                        }
                        allBoundingBoxFaces.push(i+2);
                        allBoundingBoxFaces.push(i+3);
                    }*/
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