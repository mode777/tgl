import { TglContext, Drawable, GlClearFlags, Texture } from '@tgl/core'
import { Sprite } from '@tgl/2d';
import { mat3 } from 'gl-matrix';

async function main() {
    const context = new TglContext({
        width: 512,
        height: 512,
        //antialias: true
    })
    document.body.appendChild(context.canvas);
    
    // get the WebGLRenderingContext 
    const gl = context.webGlRenderingContext;

    const texture = await Texture.fromFile(gl, '../assets/grid.png');

    const sprites: Sprite[] = []; 

    sprites[0] = new Sprite(gl, {
        texture: texture,
        frame: [0,0,128,128]
    })
    .center()
    .moveTo(160, 120)
    
    sprites[1] = new Sprite(gl, {
        texture: texture,
        frame: [128,0,128,128]
    })
    .center()
    .moveTo(320+160, 120);

    sprites[2] = new Sprite(gl, {
        texture: texture,
        frame: [0,128,128,128]
    })
    .center()
    .moveTo(160, 240+120);

    sprites[3] = new Sprite(gl, {
        texture: texture,
        frame: [128,128,128,128]
    })
    .center()
    .moveTo(320+160, 240+120);

    function draw(time) {
        // clear the screen black
        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0, 0, 0, 1]);

        const step = time / 1000;

        sprites.forEach((sprite, i) => 
            sprite.scaleTo(Math.sin(step) + 1.5, Math.sin(step) + 1.5)
            .rotate(i % 2 == 1 ? 0.01 : -0.01)
            .draw());

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}
main();