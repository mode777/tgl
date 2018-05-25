import { describe, it, expect } from "test";
import { Transform2d, Shader2d, Frame, Sprite } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3, mat4, vec3 } from 'gl-matrix';

describe("2d.Sprite", () => {

    it('Should render correctly', async() => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new TglContext(canvas);
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grid.png');

        const sprite = new Sprite(gl, {
            texture: tex,
            transform: {
                x: 160,
                y: 120,
                originY: 64,
                originX: 64,
                rotation: 1
            },
            frame: { x: 128, y: 128, w: 128, h: 128 }
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        sprite.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-transform.png', 99.9)
    })

    it('Should create from texture',async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new TglContext(canvas);
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grid.png');

        const sprite = new Sprite(gl, { texture: tex });
        
        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        sprite.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-image.png', 99.9)
    }); 
});