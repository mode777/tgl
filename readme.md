# Typescript GL

TGL (Typescript GL) is a very lightweight WebGL library written in Typescript 

## Goals

TGL aims to provide...
* ...a clean and intuitive API to the full functionalty of WebGL.
* ...a object-oriented, type-safe wrapper around WebGL.
* ...small, focused packages to keep your payload small.
* ...sensible defaults to reduce verbosity and prevent errors.

## Features
* Classes for OpenGl primitives like buffers, textures and shaders.
* No interdependencies: You can use each class as a standalone.
* Options based initialization for WebGL primitives which sensible default values.
* Grouped enumerations for WebGL constants - no more 'Invalid enum' errors.
* A 'Drawable' class to orchestrate all primitives together and render an image. 
* Performance boosts through WebGL state caching.
* Zero dependencies (except tslib), 5k gziped, tree-shaking support.

## Installation

```
npm install --save @tgl/core
```
If you are using yarn
```
yarn add @tgl/core
```

## Documentation

Typedoc documentation is available on [GitHub Pages](https://mode777.github.io/tgl/).

## Getting started

Drawing a simple triangle:

```typescript
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
context.clearColor = [0, 0, 0, 1];
context.clear(GlClearFlags.COLOR_BUFFER_BIT);

// draw the triangle
drawable.draw();
```