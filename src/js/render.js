// Global variable definitionvar canvas;
const kTagRender = "Render";
var gl;
var shaderProgram;
var physicsShaderProgram;

var cameraPosition = [0,0,-15];
var cameraRotation = [0,0,0];
var cameraScale = [1,1,1];

// Models
var models = {};

// Var objects
var objects = [];

// Model-view and projection matrix
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

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
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.
  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) {
        shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have,
  // based on its MIME type.
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object
  gl.shaderSource(shader, shaderSource);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  
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
  
  // turn on vertex position and normals attribute at specified position
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  // store location of aVertexColor variable defined in shader
  //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

  // turn on vertex color attribute at specified position
  //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  // store location of uPMatrix variable defined in shader - projection matrix 
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

  // store location of uMVMatrix variable defined in shader - model-view matrix 
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

  // normal matrix
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
}

function initPhysicsDebugShaders() {
  var p_fragmentShader = getShader(gl, "physics-debug-shader-fs");
  var p_vertexShader = getShader(gl, "physics-debug-shader-vs");
  
  // Create the shader program
  physicsShaderProgram = gl.createProgram();
  gl.attachShader(physicsShaderProgram, p_vertexShader);
  gl.attachShader(physicsShaderProgram, p_fragmentShader);
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

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(_shaderProgram.nMatrixUniform, false, normalMatrix);
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//
// initObjects
//
// Initialize the objects we'll need.
//
function initObjects() {
    models.jama = Model.fromFile("./assets/models/jama_import.obj");
    models.kocka = Model.fromFile("./assets/models/test2.obj");

    let jama = new Object(models.jama);
    let kocka1 = new Object(models.kocka);
    let kocka2 = new Object(models.kocka);

    jama.rotation[1] = 90.0;
    jama.position[1] = -2.0;

    kocka1.rotation[1] = 30;

    kocka2.position = [-2.5, 0, 0];
    kocka2.rotation = [40, 0, 0];
    kocka2.scale = [0.7, 0.5, 0.5];


    objects.push(jama);
    objects.push(kocka1);
    objects.push(kocka2);
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
  mat4.translate(mvMatrix, cameraPosition);

  //mat4.rotateZ(mvMatrix, degToRad(cameraRotation[2]));
  //mat4.rotateY(mvMatrix, degToRad(cameraRotation[1]));
  //mat4.rotateX(mvMatrix, degToRad(cameraRotation[0]));
  mat4.multiply(mvMatrix, moonRotationMatrix);
  mat4.scale(mvMatrix, cameraScale);

  for(let i = 0; i<objects.length; i++){
    mvPushMatrix();

    let obj = objects[i];
    let model = obj.model;

    mat4.translate(mvMatrix, obj.position);
    mat4.rotateZ(mvMatrix, degToRad(obj.rotation[2]));
    mat4.rotateY(mvMatrix, degToRad(obj.rotation[1]));
    mat4.rotateX(mvMatrix, degToRad(obj.rotation[0]));
    mat4.scale(mvMatrix, obj.scale);

    

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
    }
    
    gl.useProgram(shaderProgram);
    // Draw the object by binding the array buffer to the object's vertices
    // array, setting attributes, and pushing it to GL.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.verticesBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.verticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalsBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // Set the colors attribute for the vertices.
    /*
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    */
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.facesBuffer);

    // Draw the cube.
    setMatrixUniforms(shaderProgram);
    gl.drawElements(gl.TRIANGLES, model.facesBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    

    


    mvPopMatrix();
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

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    if (PHYSICS_DEBUG){
      initPhysicsDebugShaders();
    }
    initShaders();
    
    
    
    
    
    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    initObjects();
    
  }
}