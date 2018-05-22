import { describe, it, expect } from "test";
import { Transform2d, Shader2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3 } from 'gl-matrix';

describe("2d.Shader", () => {
    
    it('Should render pixel dimensions',async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new TglContext(canvas);
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grass_dirt.png', {
            filterMag: GlMagType.NEAREST
        });
        const shader = Shader2d.getInstance(gl);

        const drawable = new Drawable(gl, {
            shader: shader,
            textures: { 'uTexture': tex },
            buffers: [{
                attributes: [{ name: 'aPosition', components: 2, type: GlDataType.UNSIGNED_SHORT }],
                data: new Uint16Array([0, 0, 64, 64, 64, 0, 0, 64])
            },{
                attributes: [{ name: 'aTexcoord', components: 2, type: GlDataType.UNSIGNED_SHORT }],
                data: new Uint16Array([16, 0, 32, 16, 32, 0, 16, 16])
            }],
            uniforms: {
                'uCanvasSize': [gl.canvas.width, gl.canvas.height],
                'uTextureSize': [tex.width, tex.height]
            },
            indices: [0,1,2,0,3,1]
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/2d-shader.png', 100)
    });
   
    
});