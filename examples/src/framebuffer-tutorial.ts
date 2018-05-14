import { TglContext, Drawable, GlClearFlags, Shader, VertexBuffer, Texture, GlPixelFormat, GlMagType, Framebuffer, GlPixelType, IndexBuffer } from '@tgl/core'
import { mat4, vec3 } from 'gl-matrix'

const vertexShader = `
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}`;
const fragmentShader = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`;

// create a canvas
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

// create tgl context
const context = new TglContext(canvas);
context.state.depthTestEnabled(true);
context.state.faceCullingEnabled(true);

// pixel texture for 'inner' cube
const texture = new Texture(context.webGlRenderingContext, {
  format: GlPixelFormat.LUMINANCE,
  source: new Uint8Array([128, 64, 254, 0]),
  width: 2,
  height: 2,
  filterMag: GlMagType.NEAREST
});

// drawable for the cube
const cube = new Drawable(context.webGlRenderingContext, {
  buffers: [{
    attributes: [
      { name: 'a_position', components: 3 },
      { name: 'a_texcoord', components: 2 }],
    // one triangle per row
    data: new Float32Array([  
      -0.5, -0.5,  -0.5, 0, 0, -0.5,  0.5,  -0.5, 0, 1, 0.5, -0.5,  -0.5, 1, 0, 
      -0.5,  0.5,  -0.5, 0, 1,  0.5,  0.5,  -0.5, 1, 1, 0.5, -0.5,  -0.5, 1, 0,
      -0.5, -0.5,   0.5, 0, 0,  0.5, -0.5,   0.5, 0, 1,-0.5,  0.5,   0.5, 1, 0, 
      -0.5,  0.5,   0.5, 1, 0,  0.5, -0.5,   0.5, 0, 1, 0.5,  0.5,   0.5, 1, 1,
      -0.5,  0.5,  -0.5, 0, 0, -0.5,  0.5,   0.5, 0, 1, 0.5,  0.5,  -0.5, 1, 0, 
      -0.5,  0.5,   0.5, 0, 1,  0.5,  0.5,   0.5, 1, 1, 0.5,  0.5,  -0.5, 1, 0,
      -0.5, -0.5,  -0.5, 0, 0,  0.5, -0.5,  -0.5, 0, 1,-0.5, -0.5,   0.5, 1, 0, 
      -0.5, -0.5,   0.5, 1, 0,  0.5, -0.5,  -0.5, 0, 1, 0.5, -0.5,   0.5, 1, 1,
      -0.5, -0.5,  -0.5, 0, 0, -0.5, -0.5,   0.5, 0, 1,-0.5,  0.5,  -0.5, 1, 0, 
      -0.5, -0.5,   0.5, 0, 1, -0.5,  0.5,   0.5, 1, 1,-0.5,  0.5,  -0.5, 1, 0,
       0.5, -0.5,  -0.5, 0, 0,  0.5,  0.5,  -0.5, 0, 1, 0.5, -0.5,   0.5, 1, 0,  
       0.5, -0.5,   0.5, 1, 0,  0.5,  0.5,  -0.5, 0, 1, 0.5,  0.5,   0.5, 1, 1,])
  }],
  shader: {
    vertexSource: vertexShader,
    fragmentSource: fragmentShader
  },
  textures: {
    'u_texture': texture 
  },
})

// empty texture to render to
const targetTexture = new Texture(context.webGlRenderingContext, {
  width: 256,
  height: 256,
  source: null
});
// framebuffer which can render to the texture
const framebuffer = new Framebuffer(context.webGlRenderingContext, {
  width: 256,
  height: 256,
  colorAttachment: targetTexture.webGlTexture
});

// matrices for perspective projection
const degToRad = (d) => d * Math.PI / 180;

var fieldOfViewRadians = degToRad(60);
var modelXRotationRadians = degToRad(45);
var modelYRotationRadians = degToRad(45);

const projectionMatrix = mat4.perspective(mat4.create(), fieldOfViewRadians, 1, 1, 2000);
const viewMatrix = mat4.lookAt(mat4.create(), [0, 0, 3], [0, 0, 0], [0, 1, 0]);
const viewProjectionMatrix = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix);
// filled at runtime
const matrix = mat4.create();

// helper for drawing the cube
function drawCube() {
  mat4.rotateX(matrix, viewProjectionMatrix, modelXRotationRadians);
  mat4.rotateY(matrix, matrix, modelYRotationRadians);

  context.clear(GlClearFlags.COLOR_BUFFER_BIT | GlClearFlags.DEPTH_BUFFER_BIT);

  // update projection matrix
  cube.uniforms['u_matrix'] = matrix;
  cube.draw();
}

let then = 0;
// main loop
function drawScene(time) {
  time *= 0.001;
  var deltaTime = time - then;
  then = time;
  
  modelYRotationRadians += -0.7 * deltaTime;
  modelXRotationRadians += -0.4 * deltaTime;
  
  framebuffer.render(() => {
    cube.textures['u_texture'] = texture;
    context.state.clearColor([0,0,1,0]);
    drawCube();
  });
  
  cube.textures['u_texture'] = targetTexture;
  context.state.clearColor([1,0,0,0]);
  drawCube();
  
  requestAnimationFrame(drawScene);
}

requestAnimationFrame(drawScene);