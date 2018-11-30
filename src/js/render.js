// Global variable definitionvar canvas;
const kTagRender = "Render";
var canvas;
var gl;
var shaderProgram;
var physicsShaderProgram;

var cameraPosition = [0,0,0];
var cameraRotation = [0,0,0];

var floorY = -2.0;

var lightPosition = [0,0,0];
var flashAnimation = {
  duration: 400.0,
  maxIntensity: 6.0,
  normalIntensity: 0.5
};
var lightIntensity = flashAnimation.normalIntensity;

// Models
var models = {};
var modelsLoaded = 0;

// Var objects
var objects = [];

// Model-view and projection matrix
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var mMatrix = mat4.create();
var pMatrix = mat4.create();

var healthHUD;
var bulletsHUD;

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}


//
// initGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initGL(canvas) {
  var gl = null;
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  return gl;
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function readShader(gl, file, type) {
  return readFile(file).then(function(content){
    let shader;
    if (type == "fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return Promise.reject("Unknown shader type.");  // Unknown shader type
    }

    // Send the source to the shader object
    gl.shaderSource(shader, content);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return Promise.reject("Shader compilation error.");
    }

    return shader;
  });
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initMainShaders(vertexShader, fragmentShader) {
  // Create the shader program
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  // start using shading program for rendering
  gl.useProgram(shaderProgram);
  
  // store location of aVertexPosition and aVertexNormal variable defined in shader
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor")
  
  // turn on vertex position and normals attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // store location of aVertexColor variable defined in shader
  //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  // turn on vertex color attribute at specified position
  //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

  // store location of uMMatrix variable defined in shader - model matrix 
  shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");

  // normal matrix
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

  shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "uLightPosition");
  shaderProgram.lightIntensityUniform = gl.getUniformLocation(shaderProgram, "uLightIntensity");
}

function initPhysicsDebugShaders(vertexShader, fragmentShader) {
  // Create the shader program
  physicsShaderProgram = gl.createProgram();
  gl.attachShader(physicsShaderProgram, vertexShader);
  gl.attachShader(physicsShaderProgram, fragmentShader);
  gl.linkProgram(physicsShaderProgram);
  
  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(physicsShaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  // start using shading program for rendering
  gl.useProgram(physicsShaderProgram);
  
  // store location of aVertexPosition and aVertexNormal variable defined in shader
  physicsShaderProgram.vertexPositionAttribute = gl.getAttribLocation(physicsShaderProgram, "aVertexPosition");
  physicsShaderProgram.vertexBaryCentricAttribute = gl.getAttribLocation(physicsShaderProgram, "aBaryCentric");
  DebugLog(physicsShaderProgram.vertexBaryCentricAttribute, kTagRender, "initPhysicsDebugShaders");
  DebugLog(physicsShaderProgram.vertexPositionAttribute, kTagRender, "initPhysicsDebugShaders");
  
  // turn on vertex position and normals attribute at specified position
  gl.enableVertexAttribArray(physicsShaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(physicsShaderProgram.vertexBaryCentricAttribute);

  // store location of aVertexColor variable defined in shader
  //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  // turn on vertex color attribute at specified position
  //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  physicsShaderProgram.pMatrixUniform = gl.getUniformLocation(physicsShaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  physicsShaderProgram.mvMatrixUniform = gl.getUniformLocation(physicsShaderProgram, "uMVMatrix");

  // normal matrix
  physicsShaderProgram.nMatrixUniform = gl.getUniformLocation(physicsShaderProgram, "uNMatrix");
}

//
// setMatrixUniforms
//
// Set the uniform values in shaders for model-view and projection matrix.
//
function setMatrixUniforms(_shaderProgram) {
  gl.uniformMatrix4fv(_shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(_shaderProgram.mvMatrixUniform, false, mvMatrix);
  gl.uniformMatrix4fv(_shaderProgram.mMatrixUniform, false, mMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(_shaderProgram.nMatrixUniform, false, normalMatrix);

  gl.uniform3f(_shaderProgram.lightPositionUniform, lightPosition[0], lightPosition[1], lightPosition[2]);
  gl.uniform1f(_shaderProgram.lightIntensityUniform, lightIntensity);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function initLevel(level_tiles){
  let tileSize = 16.0;
  // let levelObjects = [];
  for(let i=0; i<level_tiles.length; i++){
    let tile = level_tiles[i];
    let modelName = tile.model;
    let model = models[modelName];
    
    // set model
    let tileObject = new Object(model, modelName);

    // set position
    tileObject.position[0] = tile.grid_xy[0] * tileSize;
    tileObject.position[1] = floorY;
    tileObject.position[2] = - tile.grid_xy[1] * tileSize;

    // set rotation
    tileObject.rotation[1] = tile.rotation;

    // Set mMatrix used for colliders
    SetmMatrix(tileObject);
    tileObject.SetmMatrix(mMatrix);
  
    // set colliders
    const colliders = model.colliders;
    for (let key in colliders) {
      if (colliders.hasOwnProperty(key)) {           
        let collider = colliders[key]
        let coll_obj = new WallColliderObject(models.kocka, model.name);
        ConstructExteriorPhysicsObject(coll_obj, tileObject, collider.min, collider.max);
      }
    }
   

    objects.push(tileObject);
  }
}

function initModels(models_arr) {
    let model_promises = [];
    for(let i=0; i<models_arr.length; i++){
      let model_def = models_arr[i];
      let model_promise = Model.fromFile(model_def.filename, model_def.fileType, model_def.colliders);
      model_promises.push(model_promise);

      model_promise.then(function(model){
        models[model_def.name] = model;
      });
    }

    return Promise.all(model_promises);
}

function initShaders() {
  let mainShaders = [readShader(gl, "assets/shaders/main.vert", "vertex"),
  readShader(gl, "assets/shaders/main.frag", "fragment")];
  
  // list of all promises
  let promises = [];

  let f1 = Promise.all(mainShaders).then((shaderArr)=>{
    let vert = shaderArr[0];
    let frag = shaderArr[1];
    initMainShaders(vert, frag);
  });
  promises.push(f1);

  //if (PHYSICS_DEBUG){
    let physicsDebugShaders = [readShader(gl, "assets/shaders/physics-debug.vert", "vertex"),
    readShader(gl, "assets/shaders/physics-debug.frag", "fragment")];
    
    let f2 = Promise.all(physicsDebugShaders).then((shaderArr)=>{
      let vert = shaderArr[0];
      let frag = shaderArr[1];
      initPhysicsDebugShaders(vert, frag);
    });

    promises.push(f2);
  //}

  // init is done when all promises are done
  return Promise.all(promises);
}

function InitObjects() {

    // let jama = new Object(models.part_jama);
    // let jama2 = new Object(models.part_ravni);

    // ConstructExteriorPhysicsObject(jama);
    //let kocka1 = new PhysicsObject(models.kocka, TypeOfBoxCollider.kInterior);
    let kocka2 = new PhysicsObject(models.kocka, "kocka2");
    let medved = new BearObject(models.medved, "MEDVED");
    medved.position = [3*16, floorY, -2*16];
    medved.velocity = [0.0, 0, 0.0];
    medved.mass = 20;
    SetmMatrix(medved);
    medved.SetmMatrix(mMatrix);

    // jama.position[1] = -2.0;

    // jama2.position[1] = -2.0
    // jama2.position[2] = -16.0;

    //kocka1.position[0] = 1;
    //kocka1.rotation[1] = 40;
    //kocka1.velocity = [-1.0, 0,0];
    

    kocka2.position = [-2.5, 0, 0];
    kocka2.rotation = [40, -20, 0];
    kocka2.scale = [0.7, 0.5, 0.5];
    //kocka2.velocity = [1.0, 0,0];
    kocka2.mass = 4;
    //kocka1.mass = 100;

    kocka2.restitution = 0.5;
    SetmMatrix(kocka2);
    kocka2.SetmMatrix(mMatrix);
    //kocka1.restitution = 1.5;

    CharacterBody = new PhysicsObject(models.kocka,"Character Body");
    CharacterBody.scale = [1.5, 2, 1.5];
    CharacterBody.position = [cameraPosition[0], cameraPosition[1], cameraPosition[2]];
    CharacterBody.OnPhysicsUpdate = characterBodyUpdate;
    SetmMatrix(CharacterBody);
    CharacterBody.SetmMatrix(mMatrix);

    // objects.push(jama);
    // objects.push(jama2);
    //objects.push(kocka1);
    // objects.push(kocka2);
    objects.push(CharacterBody);
    objects.push(medved);
    DebugLog("len objects:" + objects.length, kTagRender, "InitObjects");
    
}

function negate(vector){
  return [-vector[0], -vector[1], -vector[2]]
}


function SetmMatrix(obj) {
    mat4.identity(mMatrix);
    mat4.translate(mMatrix, obj.position);
    
    mat4.rotateZ(mMatrix, degToRad(obj.rotation[2]));
    mat4.rotateY(mMatrix, degToRad(obj.rotation[1]));
    mat4.rotateX(mMatrix, degToRad(obj.rotation[0]));
    mat4.scale(mMatrix, obj.scale);
  }


//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  // set the rendering environment to full canvas size
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  mat4.identity(mvMatrix);

  // Camera position
  mat4.rotateX(mvMatrix, degToRad(-cameraRotation[0]));
  mat4.rotateY(mvMatrix, degToRad(-cameraRotation[1]));
  mat4.rotateZ(mvMatrix, degToRad(-cameraRotation[2]));
  mat4.translate(mvMatrix, negate(cameraPosition));
  
  for(let i = 0; i<objects.length; i++){
    mvPushMatrix();
    

    let obj = objects[i];
    let model = obj.model;
    if (obj instanceof WallColliderObject) {
      mat4.set(obj.mMatrix, mMatrix);
    } else {
      SetmMatrix(obj);
      obj.SetmMatrix(mMatrix);
    }
    mat4.multiply(mvMatrix, mMatrix, mvMatrix);
    

    // Don't draw character collider because then you cannot see anything
    if (obj == CharacterBody){
      mvPopMatrix();
      continue;
    }

    //DebugLog(obj.name + " " + obj.position, kTagRender, "drawScene");

    if (PHYSICS_DEBUG) {
      gl.useProgram(physicsShaderProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, model.boundingBoxBufferVertex);
      gl.vertexAttribPointer(physicsShaderProgram.vertexPositionAttribute, model.boundingBoxBufferVertex.itemSize, gl.FLOAT, false, 0, 0);  

      gl.bindBuffer(gl.ARRAY_BUFFER, model.baricentricBuffer);
      gl.vertexAttribPointer(physicsShaderProgram.vertexBaryCentricAttribute, model.baricentricBuffer.itemSize, gl.FLOAT, false, 0, 0);

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.boundingBoxBufferfacesBuffer);

      // Draw the cube.
      setMatrixUniforms(physicsShaderProgram);
      gl.drawElements(gl.TRIANGLES, model.boundingBoxBufferfacesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }
    
    // Check after physics debug so If we need to debug physics the walls will be seen
    /*if (obj instanceof WallColliderObject) {
      mvPopMatrix();
      continue;
    }*/

    gl.useProgram(shaderProgram);

    // Draw the object by binding the array buffer to the object's vertices
    // array, setting attributes, and pushing it to GL.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.verticesBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.verticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Colors
    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, model.colorsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Faces
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.facesBuffer);

    // Draw the cube.
    setMatrixUniforms(shaderProgram);
    gl.drawElements(gl.TRIANGLES, model.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    

    


    mvPopMatrix();
  }
  
  drawHUD();
}

function drawHUD(){
  healthHUD.nodeValue = characterHealth;
  bulletsHUD.nodeValue = numBullets;
}

function initHUD(){
  let healthElement = document.getElementById("health");
  let bulletsElement = document.getElementById("bullets");

  healthHUD = document.createTextNode("");
  bulletsHUD = document.createTextNode("");

  healthElement.appendChild(healthHUD);
  bulletsElement.appendChild(bulletsHUD);
}

// Loads the config file
function loadConfig(path){
  return readFile(path).then((content)=>{
    return JSON.parse(content);
  });
}

// Reads file and returns a Promise with the content
function readFile(file){
  let rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);

  return new Promise(function(resolve, reject){
    rawFile.onreadystatechange = function() {
      if(rawFile.readyState === 4) {
        if(rawFile.status === 200 || rawFile.status == 0) {
          resolve(rawFile.responseText);
        }
      }
      reject();
    }
    rawFile.send(null);
  });
}

function startFlashAnimation(){
  flashAnimation.start = new Date();
}

function _animateFlash(){
  if(flashAnimation.start === undefined)
    return;

  let deltatime = (new Date()) - flashAnimation.start;

  let t = flashAnimation.duration;
  let x = deltatime;
  let c = flashAnimation.maxIntensity;
  let a =  (-c/(t*t));
  lightIntensity = flashAnimation.normalIntensity + a*x*x + c;

  if (lightIntensity < flashAnimation.normalIntensity){
    flashAnimation.start = undefined;
    lightIntensity = flashAnimation.normalIntensity;
  }
}

function InitRender() {
  DebugLog("Init Render and the buffers", kTagRender, "InitRender");
  canvas = document.getElementById("glcanvas");

  gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    
    let config = null;
    initShaders().then(()=>{
      return loadConfig("assets/config.json");
    })
    .then((conf)=>{
      config = conf;
      return initModels(config.models);
    })
    .then(function(){
      initLevel(config.level);
      InitObjects();
      InitPhysics();
    });
    
    initHUD();
  }
}

