import { describe, it, expect } from "test";
import { Renderer, GlClearFlags } from '@tgl/core';

describe("GlContext", () => {
    
    
    it('should create a rendering context', () => {
        const canvas = document.createElement('canvas');
        const context = new Renderer(canvas);
        expect(context.handle).toBeInstanceOf(WebGLRenderingContext);
    });
    
    it('should clear the canvas in red',async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new Renderer(canvas);
        context.clearColor = [1,0,0,1];
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        
        await expect(context.handle).toLookLike('./assets/ref.png', 100);
    });

    
});