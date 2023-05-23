#version 300 es
precision highp float;

in vec2 texCoords;

out vec4 out_Color;

uniform sampler2D textureSampler;

void main() {
    out_Color = texture(textureSampler, texCoords);
}