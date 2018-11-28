// set medium percision 
precision mediump float;

varying float vertLight;
varying float vertLightIntensity;
varying vec3 vertColor;

void main(void) {
    // Setting color of fragments to normals
    gl_FragColor = vec4(vertColor*vertLight*vertLightIntensity,1.0);
}
