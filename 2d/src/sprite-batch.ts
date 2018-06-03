import { Texture, Drawable, Shader, VertexBuffer, IndexBuffer, GlDataType, TglState, vec2 } from '@tgl/core';
import { Transform2d, Transform2dOptions } from './transform-2d';
import { Shader2d } from './shader-2d';
import { Frame, ISprite } from './common';
import { BaseSprite } from './base-sprite';

const FRAME_SIZE = 4 * 4;
const INDICES_FRAME = 6;
const VERTICES_FRAME = 4;

export interface SpriteBatchOptions {
    size: number,
    texture: Texture,
    shader?: Shader,
    sprites?: SpriteBatchSpriteOptions[] 
}

const spriteBatchDefaults: SpriteBatchOptions = {
    sprites: [],
    texture: null,
    size: 16
}

export interface SpriteBatchSpriteOptions {
    index: number,
    frame?: Frame,
    transform?: Transform2d | Transform2dOptions 
}

export class SpriteBatch {    
    public readonly size: number;
    
    private readonly vertexData: Int16Array;
    private readonly texture: Texture;
    private readonly drawable: Drawable;
    private readonly vertexBuffer: VertexBuffer;
    private readonly indexBuffer: IndexBuffer;
    private readonly shader: Shader;
    private readonly transform = new Transform2d();
    private readonly state = TglState.getCurrent(this.gl);
    private readonly proxies: ProxySprite[] = [];
    private readonly textureSize: vec2<number>;

    constructor(protected gl: WebGLRenderingContext, options: SpriteBatchOptions){
        const opt = { ...spriteBatchDefaults, ...options }

        this.size = opt.size;
        this.texture = opt.texture;
        this.vertexData = new Int16Array(FRAME_SIZE * opt.size);
        this.vertexBuffer = this.createVertexBuffer();
        this.shader = opt.shader || Shader2d.getInstance(gl);
        this.indexBuffer = this.createIndexBuffer();
        this.textureSize = [this.texture.width, this.texture.height];
        
        this.drawable = new Drawable(gl, {
            shader: this.shader,
            textures: { 'uTexture': this.texture },
            buffers: [this.vertexBuffer],
            indices: this.indexBuffer,
            uniforms: {
                'uTextureSize': this.textureSize,
                'uProject': Shader2d.getProjectionMatrix(this.state.viewport()),
                'uTransform': this.transform.matrix
            }
        });

        opt.sprites.forEach(x => this.createSprite(x));
    }    

    public setSprite(index: number, frame: Frame, transform: Transform2d){
        const data = this.vertexData;
        const offset = FRAME_SIZE * index;

        const x = frame[0];
        const y = frame[1];
        const w = frame[2];
        const h = frame[3];
        
        transform.transform(0, 0, data, offset + VERTICES_FRAME * 0);
        data[offset + VERTICES_FRAME * 0 + 2] = x;
        data[offset + VERTICES_FRAME * 0 + 3] = y;
        transform.transform(w, h, data, offset + VERTICES_FRAME * 1);
        data[offset + VERTICES_FRAME * 1 + 2] = x + w;
        data[offset + VERTICES_FRAME * 1 + 3] = y + h;
        transform.transform(w, 0, data, offset + VERTICES_FRAME * 2);
        data[offset + VERTICES_FRAME * 2 + 2] = x + w;
        data[offset + VERTICES_FRAME * 2 + 3] = y;
        transform.transform(0, h, data, offset + VERTICES_FRAME * 3);
        data[offset + VERTICES_FRAME * 3 + 2] = x;
        data[offset + VERTICES_FRAME * 3 + 3] = y + h;
    }

    public clearSprite(index: number){
        const data = this.vertexData;
        const offset = FRAME_SIZE * index;
        
        for (let i = 0; i < FRAME_SIZE; i++) {
            data[offset+i] = 0;
        }
    }

    public createSprite(options: SpriteBatchSpriteOptions): ISprite {
        const frame = options.frame || [0,0,this.texture.width, this.texture.height];
        const transform = options.transform instanceof Transform2d 
            ? options.transform 
            : new Transform2d(options.transform || null);

        const proxy = new ProxySprite(this, options.index, frame, transform);
        this.proxies.push(proxy);

        return proxy;
    }

    public update(){
        this.proxies.forEach(x => x.update());
        this.updateBuffer();
    }

    public draw(){
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;
        this.drawable.uniforms['uTextureSize'] = this.textureSize;

        this.drawable.draw();
    }

    private updateBuffer(){
        this.vertexBuffer.data(this.vertexData);
    }

    private createVertexBuffer(){
        return new VertexBuffer(this.gl, {
            attributes: [
                { name: 'aPosition', components: 2, type: GlDataType.SHORT },
                { name: 'aTexcoord', components: 2, type: GlDataType.SHORT }
            ],
            data: this.vertexData
        })
    }

    private createIndexBuffer(){
        const indexData = new Uint16Array(INDICES_FRAME * this.size);
        let vertex = 0;

        for(let i = 0; i < indexData.length; i += INDICES_FRAME){
            indexData[i  ] = vertex + 0;
            indexData[i+1] = vertex + 1;
            indexData[i+2] = vertex + 2;
    
            indexData[i+3] = vertex + 0;
            indexData[i+4] = vertex + 3;
            indexData[i+5] = vertex + 1;
    
            vertex += VERTICES_FRAME;
        }

        return new IndexBuffer(this.gl, indexData);
    }
}

class ProxySprite extends BaseSprite {

    private isDirty = true;
    private bbox: Frame = [0,0,0,0];

    constructor(private batch: SpriteBatch,private index: number, frame: Frame, transform: Transform2d){
        super(frame, transform);        
    }

    get boundingBox(): [number,number,number,number] {
        if(this.isDirty){
            this.calculateBoundingBox(this.bbox)
            this.isDirty = false;
        }
        return this.bbox;
    }

    update(){
        if(this.isDirty){            
            this.batch.setSprite(this.index, this.frame, this.transform)
            this.isDirty = false;
        }
    }

    delete(){
        this.batch.clearSprite(this.index);
    }

    protected setDirty(){
        this.isDirty = true;
    }
}