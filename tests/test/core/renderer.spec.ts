import { describe, it, expect } from "test";
import { TglContext, GlClearFlags } from '@tgl/core';

describe("Core.GlContext", () => {
    
    
    it('should create a rendering context', () => {
        const canvas = document.createElement('canvas');
        const context = new TglContext({ canvas: canvas });
        expect(context.webGlRenderingContext).toBeInstanceOf(WebGLRenderingContext);
    });
    
    it('should clear the canvas in red',async () => {
        const canvas = document.createElement('canvas');

        const context = new TglContext({ 
            canvas: canvas,
            width: 320,
            height: 240 
        });
        context.state.clearColor([1,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        
        await expect(context.webGlRenderingContext).toLookLike('./assets/ref.png', 100);
    });

    
});