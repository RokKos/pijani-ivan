// atributes for setting vertex position and color
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;

uniform mat4 uMMatrix; // model-matrix
uniform mat4 uMVMatrix;	// model-view matrix
uniform mat4 uPMatrix;	// projection matrix
uniform mat3 uNMatrix;	// projection matrix

uniform vec3 uLightPosition;

uniform float uLightIntensity;

varying float vertLight;
varying float vertLightIntensity;
varying vec3 vertColor;

// variable for passing color from vertex shader to fragment shader
void main(void) {
    // calculate the vertex position
    vec3 vertexPosition = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vec3 transformedNormal = uNMatrix * aVertexNormal;
    vec3 toLight = uLightPosition - vertexPosition;
    vec3 lightDirection = normalize(toLight);
    vec3 eye = normalize(-vertexPosition);
    vec3 lightDir = normalize(lightDirection + eye);
    vertLight = max(dot(transformedNormal, lightDirection), 0.0);

    float distanceToLight = length(toLight)+0.001;
    float squareDistance = 1.0/(distanceToLight * distanceToLight);
    vertLightIntensity = uLightIntensity * min(1.0, 100.0 * squareDistance);

    vertColor = aVertexColor;
    
    // vertNormal = vec4(transformedNormal, 1.0);
}
