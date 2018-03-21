import { GlContext, GlClearFlags, ArrayBuffer, Texture } from '@tgl/core';

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const context = new GlContext(canvas);
const gl = context.handle;

context.clear(GlClearFlags.COLOR_BUFFER_BIT, 1);

const buffer = new ArrayBuffer(gl, {
    data: [ 
        -1,1,0.5, 1,-1,0.5, -1,-1,0.5
     ],
     attribute: "coord"
});

const texture = new Texture(gl, {
    source: "assets/my_texture"
})