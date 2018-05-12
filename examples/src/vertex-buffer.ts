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
varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}`;
const vertexShader = `precision mediump float;
attribute vec2 aPosition;
attribute vec3 aColor;

varying vec4 vColor;

void main(void) {
    vColor = vec4(aColor, 1.0);
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;


// express what you want to render in a drawable object
const drawable = new Drawable(gl, {
    buffers: [{
        data: [
            -0.5, -0.5, 1, 0, 0,
            0.5, -0.5, 0, 1, 0,
            0, 0.5, 0, 0, 1
        ],
        attributes: [
            { components: 2, name: "aPosition" },
            { components: 3, name: "aColor" }
        ]
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