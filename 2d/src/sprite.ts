import { Texture, VertexBuffer, Shader, Drawable, GlDataType, TglState, vec2, TglContext } from '@tgl/core';
import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Frame, ISprite, FlipFlags } from './common';
import { Shader2d } from './shader-2d';
import { BaseSprite } from './base-sprite';
import { Context2d } from './context-2d';

export class SpriteOptions {
    texture: Texture;
    transform?: Transform2dCreateOptions | Transform2d;
    frame?: Frame;
    flip?: FlipFlags;
}

export class Sprite extends BaseSprite {

    private drawable: Drawable;
    private data: Int16Array;
    private dirty = true;
    private flipState: FlipFlags;
    private shader = this.context.shader;
    private texture: Texture;

    private readonly bbox: Frame = [0,0,0,0];
    private readonly textureSize: vec2<number>;

    constructor(protected context: Context2d, options: SpriteOptions){
        super(options.frame || [ 0, 0, options.texture.width, options.texture.height ], 
            options.transform instanceof Transform2d 
            ? options.transform 
            : new Transform2d(options.transform || null));
        
        this.texture = options.texture;
    
        this.flipState = options.flip || FlipFlags.None;
        this.textureSize = [this.texture.width, this.texture.height];

        this.drawable = new Drawable(context.tglContext, {
            shader: context.shader.tglShader,
            buffers: [this.createBuffer(this.frame, this.flipState)],
            indices: [0,1,2,0,3,1]            
        });
    }

    protected setDirty(){
        this.dirty = true;
    }

    public get boundingBox(){
        if(this.dirty){
            this.calculateBoundingBox(this.bbox);
            this.dirty = false;
        }
        return this.bbox;
    }

    public draw(){
        this.shader.modelMatrix = this.transform.matrix;
        this.shader.textureSize = this.textureSize;
        this.shader.texture = this.texture;

        this.drawable.draw();
    }    

    public flipTo(flags: FlipFlags){
        // bitwise xor to determine flipping direction
        this.flipInternal(this.flipState ^ flags);
        this.flipState = flags;
        this.drawable.buffers[0].subData(0, this.data);
    }

    public flip(flags: FlipFlags){
        this.flipInternal(flags);
        // bitwise xor to determine flipping state
        this.flipState = this.flipState ^ flags;
        this.drawable.buffers[0].subData(0, this.data);
    }

    // public update(){
    //     this.drawable.buffers[0].subData(0, this.data);
    // }

    private createBuffer(frame: Frame, flip: FlipFlags){
        const x = frame[0];
        const y = frame[1];
        const w = frame[2];
        const h = frame[3];

        this.data = new Int16Array([
            0, 0, x, y,
            w, h, x + w, y + h,
            w, 0, x + w, y,
            0, h, x, y + h
        ]);

        this.flipInternal(flip);

        return new VertexBuffer(this.context.tglContext, {
            attributes: this.shader.attributes,
            data: this.data
        });
    }

    private flipInternal(flip: FlipFlags){
        if((flip & FlipFlags.FlippedDiagonally) > 0){
            this.switch(2,6);
            this.switch(3,7);
        }
        if((flip & FlipFlags.FlippedHorizontally) > 0){
            this.switch(2, 10);
            this.switch(6, 14);
        }
        if((flip & FlipFlags.FlippedVertically) > 0){
            this.switch(3, 15);
            this.switch(7, 11);
        }
    }

    private switch(x: number, y: number){
        const temp = this.data[y];
        this.data[y] = this.data[x];
        this.data[x] = temp;
    }

}