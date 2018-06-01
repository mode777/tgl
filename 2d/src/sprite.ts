import { Texture, VertexBuffer, Shader, Drawable, GlDataType, TglState } from '@tgl/core';
import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Frame, ISprite } from './common';
import { Shader2d } from './shader-2d';
import { BaseSprite } from './base-sprite';

export class SpriteOptions {
    texture: Texture;
    transform?: Transform2dCreateOptions | Transform2d;
    frame?: Frame;
    shader?: Shader;
}

export class Sprite extends BaseSprite {

    private drawable: Drawable;
    private readonly state = TglState.getCurrent(this.gl);
    private readonly bbox: Frame = [0,0,0,0];
    private dirty = true;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions){
        super(options.frame || [ 0, 0, options.texture.width, options.texture.height ], 
            options.transform instanceof Transform2d 
            ? options.transform 
            : new Transform2d(options.transform || null));
        
        const texture = options.texture;
        const shader = options.shader || Shader2d.getInstance(gl);
       
        this.drawable = new Drawable(gl, {
            shader: shader,
            textures: { 'uTexture': texture },
            buffers: [this.createBuffer(this.frame)],
            indices: [0,1,2,0,3,1],
            uniforms: {
                'uTextureSize': [texture.width, texture.height],
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

        this.drawable.draw();
    }    

    private createBuffer(frame: Frame){
        const x = frame[0];
        const y = frame[1];
        const w = frame[2];
        const h = frame[3];

        return new VertexBuffer(this.gl, {
            attributes: [
                { name: 'aPosition', components: 2, type: GlDataType.SHORT },
                { name: 'aTexcoord', components: 2, type: GlDataType.SHORT }
            ],
            data: new Int16Array([
                0, 0, x, y,
                w, h, x + w, y + h,
                w, 0, x + w, y,
                0, h, x, y + h
            ])
        })
    }
}