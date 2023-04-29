uniform sampler2D uTexture;
varying vec2 v_uv;
varying float v_elevation;

void main() {
    vec4 textureColor = texture2D(uTexture, v_uv);
    textureColor.rgb *= v_elevation * 2.0 + 0.9;
    gl_FragColor = textureColor;
}