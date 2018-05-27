import { describe, it, expect, getContext } from "test";
import { Transform2d, Shader2d, Frame, SpriteBatch } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3, mat4, vec3 } from 'gl-matrix';

describe("2d.SpriteBatch", () => {

    it('Should render correctly', async() => {
        const context = getContext();
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grid.png');

        const batch = new SpriteBatch(gl, {
            size: 4,
            texture: tex
        });

        batch.setSprite(0, [128, 128, 128, 128], new Transform2d({
            x: 120,
            y: 120,
            originY: 64,
            originX: 64,
            rotation: 1
        }));

        batch.setSprite(1, [0, 0, 128, 128], new Transform2d({
            x: 200,
            y: 120,
            originY: 64,
            originX: 64,
            rotation: 1
        }));

        batch.update();

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        batch.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-batch.png', 97)
    })
});