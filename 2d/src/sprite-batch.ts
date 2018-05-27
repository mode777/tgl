import { Texture, Drawable, Shader, VertexBuffer, IndexBuffer, GlDataType, TglState } from '@tgl/core';
import { Transform2d } from './transform-2d';
import { Shader2d } from './shader-2d';
import { Frame, ISprite } from './common';

const FRAME_SIZE = 4 * 4;
const INDICES_FRAME = 6;
const VERTICES_FRAME = 4;

export interface SpriteBatchOptions {
    size: number,
    texture: Texture,
    shader?: Shader,
    frames?: Frame[] 
}

const spriteBatchDefaults = {
    sprites: []
}

export class SpriteBatch {
    
    private readonly vertexData: Int16Array;
    private readonly texture: Texture;
    private readonly drawable: Drawable;
    private readonly vertexBuffer: VertexBuffer;
    private readonly indexBuffer: IndexBuffer;
    private readonly shader: Shader;
    private readonly transform = new Transform2d();
    private readonly size: number;
    private readonly state = TglState.getCurrent(this.gl);

    constructor(protected gl: WebGLRenderingContext, options: SpriteBatchOptions){
        const opt = { ...spriteBatchDefaults, ...options }

        this.size = opt.size;
        this.texture = opt.texture;
        this.vertexData = new Int16Array(FRAME_SIZE * opt.size);
        this.vertexBuffer = this.createVertexBuffer();
        this.shader = opt.shader || Shader2d.getInstance(gl);
        this.indexBuffer = this.createIndexBuffer();

        this.drawable = new Drawable(gl, {
            shader: this.shader,
            textures: { 'uTexture': this.texture },
            buffers: [this.vertexBuffer],
            indices: this.indexBuffer,
            uniforms: {
                'uTextureSize': [this.texture.width, this.texture.height],
                'uProject': Shader2d.getProjectionMatrix(this.state.viewport()),
                'uTransform': this.transform.matrix
            }
        })
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

    public update(){
        this.updateBuffer();
    }

    public draw(){
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;

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