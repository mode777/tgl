import { TglContext, Drawable, GlClearFlags, Texture } from '@tgl/core'
import { Sprite } from '@tgl/2d';

async function main() {
    // create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    document.body.appendChild(canvas);

    const context = new TglContext(canvas);
    const gl = context.webGlRenderingContext;

    const texture = await Texture.fromFile(gl, '../assets/grid.png');

    const sprites: Sprite[] = []; 

    sprites[0] = new Sprite(gl, {
        texture: texture,
        frame: { x: 0, y: 0, w: 128, h: 128 }
    })
    .center()
    .moveTo(160, 120)
    
    sprites[1] = new Sprite(gl, {
        texture: texture,
        frame: { x: 128, y: 0, w: 128, h: 128 }
    })
    .center()
    .moveTo(320+160, 120);

    sprites[2] = new Sprite(gl, {
        texture: texture,
        frame: { x: 0, y: 128, w: 128, h: 128 }
    })
    .center()
    .moveTo(160, 240+120);

    sprites[3] = new Sprite(gl, {
        texture: texture,
        frame: { x: 128, y: 128, w: 128, h: 128 }
    })
    .center()
    .moveTo(320+160, 240+120);

    function draw(time) {
        // clear the screen black
        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        const step = time / 1000;

        sprites.forEach((sprite, i) => 
            //sprite.scaleTo(Math.sin(step) + 1.5, Math.sin(step) + 1.5)
            sprite.scaleTo(0.5, 1)
            .rotate(i % 2 == 1 ? 0.01 : -0.01)
            .draw());

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}
main();

