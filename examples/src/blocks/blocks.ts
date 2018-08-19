import { Tileset } from '@tgl/2d';
import { Texture, TglContext } from '@tgl/core';

var block1 = [
    0,0,0,0,
    1,1,0,0,
    0,1,1,0,
    0,0,0,0
]



export const tgl = new TglContext({
    width: 320,
    height: 240
});

export const gl = tgl.webGlRenderingContext;

export const $texture = Texture.fromFile(gl, '../assets/blocks.png')

export const $tilset = (async () => {
    return new Tileset({
        texture: await $texture,
        tileHeight: 16,
        tileWidth: 16
    });
})()

