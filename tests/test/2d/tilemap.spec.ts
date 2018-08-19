import { getContext, describe, it, expect } from "test";
import { Texture, GlClearFlags } from '@tgl/core';
import { Tilemap, Context2d } from '@tgl/2d';

describe("2d.Tilemap", () => {

    it('Render map', async () => {
        const context = getContext();
        const ctx2d = new Context2d(context);
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grass_dirt.png');

        const map = new Tilemap(ctx2d, {
            data: [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9,10,11,12],
            height: 3,
            width: 4,
            tileset: {
                texture: tex,
                tileWidth: 16,
                tileHeight: 16
            }               
        });

        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1])
        map.draw();

        await expect(gl).toLookLike('./assets/reference/2d-tilemap.png', 99)
    });

    
});