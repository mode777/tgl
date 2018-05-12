import { TglContext, Drawable, GlClearFlags } from '@tgl/core'

// create a canvas
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
document.body.appendChild(canvas);

// use of TglContext is completely optional
const context = new TglContext(canvas);
// get the WebGLRenderingContext 
const gl = context.webGlRenderingContext;

// define shaders (TGL can also load shaders from files)
const fragmentShader = `precision mediump float;
void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;
const vertexShader = `precision mediump float;
attribute vec2 aPosition;

void main(void) {
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

// express what you want to render in a drawable object
const drawable = new Drawable(gl, {
    buffers: [{
        // the triangle
        data: [-0.5,-0.5, 0.5,-0.5, 0,0.5],
        // tell the shader that this data should go to aPosition and is interpreted as a vec2 
        attributes: [{ name: 'aPosition', components: 2 }]
    }],
    shader: {
        vertexSource: vertexShader,
        fragmentSource: fragmentShader 
    }
});

// clear the screen black
context.state.clearColor([0, 0, 0, 1]);
context.clear(GlClearFlags.COLOR_BUFFER_BIT);

// draw the triangle
drawable.draw();