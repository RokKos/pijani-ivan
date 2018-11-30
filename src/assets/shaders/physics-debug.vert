varying vec3 vBC;
// atributes for setting vertex position and color
attribute vec3 aBaryCentric;
attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;	// model-view matrix
uniform mat4 uPMatrix;	// projection matrix
uniform mat3 uNMatrix;	// projection matrix

void main(void){
    vBC = aBaryCentric;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}