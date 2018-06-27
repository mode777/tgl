import { Texture, VertexBuffer, Shader, Drawable, GlDataType, TglState, vec2 } from '@tgl/core';
import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Frame, ISprite, FlipFlags } from './common';
import { Shader2d } from './shader-2d';
import { BaseSprite } from './base-sprite';

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

    private readonly state = TglState.getCurrent(this.gl);
    private readonly bbox: Frame = [0,0,0,0];
    private readonly textureSize: vec2<number>;
    private readonly flip: FlipFlags;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions){
        super(options.frame || [ 0, 0, options.texture.width, options.texture.height ], 
            options.transform instanceof Transform2d 
            ? options.transform 
            : new Transform2d(options.transform || null));
        
        const texture = options.texture;
        const shader = Shader2d.getInstance(gl);
    
        this.flip = options.flip || FlipFlags.None;
        this.textureSize = [texture.width, texture.height];

        this.drawable = new Drawable(gl, {
            shader: shader,
            textures: { 'uTexture': texture },
            buffers: [this.createBuffer(this.frame, this.flip)],
            indices: [0,1,2,0,3,1],
            uniforms: {
                'uTextureSize': this.textureSize,
                'uProject': Shader2d.getProjectionMatrix(this.state.viewport()),
                'uTransform': this.transform.matrix
            }
        })
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
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;
        this.drawable.uniforms['uTextureSize'] = this.textureSize;

        this.drawable.draw();
    }    

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

        return new VertexBuffer(this.gl, {
            attributes: [
                { name: 'aPosition', components: 2, type: GlDataType.SHORT },
                { name: 'aTexcoord', components: 2, type: GlDataType.SHORT }
            ],
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