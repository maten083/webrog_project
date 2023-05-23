#version 300 es
precision highp float;

in vec3 position;
in vec2 textureCoords;

out vec2 texCoords;

uniform mat4 transformation;

void main() {
    gl_Position = transformation * vec4(position, 1.0f);
    texCoords = textureCoords;
}