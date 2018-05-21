import { describe, it, expect } from "test";
import { Transform2d, Shader2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType } from '@tgl/core';
import { vec2, mat3 } from 'gl-matrix';

describe("2d.Shader", () => {
    
    it('Should render pixel dimensions',async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new TglContext(canvas);
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grass_dirt.png');
        const shader = Shader2d.getInstance(gl);

        const drawable = new Drawable(gl, {
            shader: shader,
            textures: {
                //'uTexture': tex
            },
            buffers: [{
                attributes: [{ name: 'aPosition', components: 2, type: GlDataType.UNSIGNED_SHORT }],
                //attributes: [{ name: 'aPosition', components: 2 }],
                data: new Uint16Array([50, 50, 50, 100, 100, 50])
            }, 
            // {
            //     attributes: [{ name: 'aTexcoord', components: 2 }],
            //     data: new Float32Array([0, 0, 0, 1, 1, 0])
            // }
        ],
            uniforms: {
                //'uCanvasSize': [320, 240],//gl.canvas.width, gl.canvas.height],
                //'uTextureSize': [128,128]
            }
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });
   
    
});