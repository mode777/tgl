import { Texture, Drawable, Shader } from '@tgl/core';
import { Transform2d } from './transform-2d';
import { Shader2d } from './shader-2d';
import { Frame, ISprite } from './common';

export interface SpriteBatchOptions {
    size: number,
    texture: Texture,
    shader?: Shader,
    frames?: Frame[] 
}

const spriteBatchDefaults = {
    frames: []
}

const FRAME_SIZE = 4 * 4;

export class SpriteBatch {
    
    private readonly data: Int16Array;
    private readonly texture: Texture;
    private readonly drawable: Drawable;
    private readonly shader: Shader;
    private readonly transform = new Transform2d();

    constructor(gl: WebGLRenderingContext, options: SpriteBatchOptions){
        const opt = { ...spriteBatchDefaults, ...options }

        this.texture = opt.texture;
        this.data = new Int16Array(FRAME_SIZE * opt.size);
        this.shader = opt.shader || Shader2d.getInstance(gl);
    }    
}

export interface BatchedSpriteOptions {
    data: Int16Array,
    frame?: Frame,
    transform?: Transform2d;
}

class BatchedSprite implements ISprite {

    boundingBox: [number, number, number, number];

    public center(x = true, y = true): ISprite {
        throw new Error("Method not implemented.");
    }
    
   public  moveTo(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }

    public move(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public rotateTo(r: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public rotate(r: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public scale(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public scaleTo(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public moveOrigin(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }
    public moveOriginTo(x: number, y: number): ISprite {
        throw new Error("Method not implemented.");
    }
}