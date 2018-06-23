import { Texture } from '@tgl/core';
import { Frame } from './common';

const emptyFrame: Frame = [0,0,0,0];

export interface TilesetOptions {
    texture: Texture,
    tileWidth: number,
    tileHeight: number
}

export class Tileset {

    private readonly frames: Frame[]; 
    
    readonly width: number;
    readonly height: number;
    readonly tileWidth: number;
    readonly tileHeight: number;
    readonly texture: Texture;

    constructor(options: TilesetOptions){
        this.tileWidth = options.tileWidth;
        this.tileHeight = options.tileHeight;
        this.texture = options.texture;

        this.width = Math.floor(options.texture.width / options.tileWidth);
        this.height = Math.floor(options.texture.height / options.tileHeight);
        this.frames = new Array(this.width * this.height);
        
        this.createFrames();
    }

    frameForId(id: number): Frame {
        if(id === 0)
            return emptyFrame;
            
        return this.frames[id - 1];
    }

    private createFrames(){
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.frames[(y * this.width) + x] = [
                    x * this.tileWidth,
                    y * this.tileHeight,
                    this.tileWidth,
                    this.tileHeight
                ]; 
            }            
        }
    }

}