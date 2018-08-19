import { describe, it, expect, getContext } from "test";
import { Transform2d, Shader2d, Frame, Sprite, Context2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3, mat4, vec3 } from 'gl-matrix';

describe("2d.Sprite", () => {

    it('Should render correctly', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite = new Sprite(ctx2d, {
            texture: tex,
            transform: {
                x: 160,
                y: 120,
                originY: 64,
                originX: 64,
                rotation: 1
            },
            frame: [128, 128, 128, 128]
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        sprite.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-transform.png', 97)
    })

    it('Should create from texture',async () => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite = new Sprite(ctx2d, { texture: tex });
        
        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        sprite.draw();

        await expect(gl).toLookLike('./assets/reference/2d-sprite-image.png', 99.9)
    });
    
    it('Should calculate bbox',async () => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(ctx2d.tglContext, '../assets/2d/grid.png');

        const sprite = new Sprite(ctx2d, { 
            texture: tex,
            frame: [128,128,128,128],
            transform: {
                x: 64,
                y: 64,
                originX: 64,
                originY: 64
            } 
        });
        
        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        const bbox = sprite.boundingBox;

        expect(bbox[0]).toBe(0);
        expect(bbox[1]).toBe(0);
        expect(bbox[2]).toBe(128);
        expect(bbox[3]).toBe(128);
    });
});