import { describe, it, expect, getContext } from "test";
import { Transform2d, Shader2d, Frame, SpriteBatch } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3, mat4, vec3 } from 'gl-matrix';

describe("2d.SpriteBatch", () => {

    it('Should create sprites', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(gl, '../assets/2d/grid.png');

        const batch = new SpriteBatch(gl, {
            size: 4,
            texture: tex,
            sprites: [
                { index: 0, frame: [0,0,32,32], transform: { x: 50, y: 50, rotation: 1 } },
                { index: 1, frame: [128,128,32,32], transform: { x:150, y: 150, rotation: 2 } },
                { index: 2, frame: [128,0,32,32], transform: { x: 150, y: 50, rotation: 3 } },
                { index: 3, frame: [0,128,32,32], transform: { x: 50, y: 150, rotation: 4 } },
            ]
        });

        batch.update();

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        batch.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-batch-sprites.png', 97)
    });

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