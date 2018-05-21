import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Texture } from '@tgl/core';
import { Frame } from './frame';

export class SpriteOptions {
    texture: Texture;
    transform?: Transform2dCreateOptions | Transform2d;
    frame?: Frame 
}

export class Sprite {

    public readonly transform: Transform2d;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions){

    }

    private createBuffer(){
        
    }
}