import { TilesetOptions, Tileset } from './tileset';
import { BufferData } from '@tgl/core';
import { SpriteBatch, Transform2d } from './main';
import { Context2d } from './context-2d';

export interface TilemapOptions {
    tileset: Tileset | TilesetOptions,
    data?: number[],
    width: number,
    height: number
}

export class Tilemap {

    readonly tileset: Tileset;
    readonly width: number;
    readonly height: number;

    private readonly batch: SpriteBatch;
    private readonly transforms: Transform2d[];
    private readonly data: number[];

    constructor(private context: Context2d, options: TilemapOptions){
        this.width = options.width;
        this.height = options.height;

        this.tileset = options.tileset instanceof Tileset
            ? options.tileset
            : new Tileset(options.tileset);

        this.batch = new SpriteBatch(this.context, {
            size: this.width * this.height,
            texture: this.tileset.texture
        });

        this.transforms = new Array(this.width*this.height);
        this.createTransforms();

        this.data = new Array(this.width*this.height);
        if(options.data){
            if(options.data.length !== this.width * this.height)
                throw 'Supplied data array is invalid size';

            this.setData(options.data);
            this.update();
        }
    }

    public setTile(x: number, y: number, id: number){
        this.setTileIndex((y * this.width) + x, id);
    }

    public setData(data: number[]){
        for (let i = 0; i < data.length; i++) {
            this.setTileIndex(i, data[i]);
        }
    }

    public update(){
        this.batch.update();
    }

    public draw(){
        this.batch.draw();
    }

    private setTileIndex(index: number, id: number){
        const frame = this.tileset.frameForId(id);
        this.batch.setSprite(index, frame, this.transforms[index]);
        this.data[index] = id;
    }

    private createTransforms(){
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.transforms[(y * this.width) + x] = new Transform2d({
                    enableOrigin: false,
                    enableRotation: false,
                    enableScale: false,
                    x: x * this.tileset.tileWidth,
                    y: y * this.tileset.tileHeight
                });                   
            }            
        }
    }

}