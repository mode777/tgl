import { describe, it, expect, getContext } from "test";
import { GltfLoader } from '@tgl/gltf';
import { TglContext, Shader, Drawable, GlClearFlags } from '@tgl/core';

const vertex1 = `attribute vec4 POSITION;
	
void main(void) {
    gl_Position = POSITION;
}`;

const fragment1 = `precision mediump float;

void main(void) {
    gl_FragColor = vec4(1, 1, 1, 1);
 }`;

describe("Gltf.Loader", () => {
    
    it('should load file', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;
        
        const gltf = new GltfLoader(context.webGlRenderingContext, './../assets/gltf/minimal.json');
        await gltf.load();
        
        const primitive = gltf.meshes[0].primitives[0];

        const drawable = new Drawable(context.webGlRenderingContext, {
            indices: primitive.indexBuffer,
            buffers: primitive.vertexBuffers,
            shader: {
                fragmentSource: fragment1,
                vertexSource: vertex1
            }
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(context.webGlRenderingContext).toLookLike('./../assets/reference/gltf-simple.png', 100)
    });
    
});