import { describe, it, getContext, expect } from "test";
import { Texture, GlClearFlags, BlendMode } from '@tgl/core';
import { Sprite, Context2d } from '@tgl/2d';

describe("2d.BlendingModes", () => {

    it('should blend alpha', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');
        const texAlpha = await Texture.fromFile(context, '../assets/2d/alphatest.png');

        const sprite1 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [128, 128, 128, 128]
        });

        const sprite2 = new Sprite(ctx2d, {
            texture: texAlpha,            
            frame: [0, 0, 128, 128]
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);
        
        sprite1.draw();
        context.setBlendMode(BlendMode.Alpha);
        sprite2.draw();

        await expect(context.webGlRenderingContext).toLookLike('./assets/reference/2d-blend-alpha.png', 97)
    })

    it('should blend additive', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite1 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [128, 128, 128, 128]
        });

        const sprite2 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [0, 0, 128, 128]
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);
        
        sprite1.draw();
        context.setBlendMode(BlendMode.Add);
        sprite2.draw();

        await expect(gl).toLookLike('./assets/reference/2d-blend-add.png', 97)
    })

    it('should blend multiplicative', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite1 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [128, 128, 128, 128]
        });

        const sprite2 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [0, 0, 128, 128]
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);
        
        sprite1.draw();
        context.setBlendMode(BlendMode.Multiply);
        sprite2.draw();

        await expect(gl).toLookLike('./assets/reference/2d-blend-multiply.png', 97)
    })

    it('should blend screen', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite1 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [128, 128, 128, 128]
        });

        const sprite2 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [0, 0, 128, 128]
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);
        
        sprite1.draw();
        context.setBlendMode(BlendMode.Screen);
        sprite2.draw();

        await expect(gl).toLookLike('./assets/reference/2d-blend-screen.png', 97)
    })

    it('should blend subtract', async() => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grid.png');

        const sprite1 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [128, 128, 128, 128]
        });

        const sprite2 = new Sprite(ctx2d, {
            texture: tex,            
            frame: [0, 0, 128, 128]
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);
        
        sprite1.draw();
        context.setBlendMode(BlendMode.Subtract);
        sprite2.draw();

        await expect(gl).toLookLike('./assets/reference/2d-blend-subtract.png', 97)
    })
    
    
});