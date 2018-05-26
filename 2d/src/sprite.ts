import { Texture, VertexBuffer, Shader, Drawable, GlDataType, TglState } from '@tgl/core';
import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Frame, ISprite } from './common';
import { Shader2d } from './shader-2d';

export class SpriteOptions {
    texture: Texture;
    transform?: Transform2dCreateOptions | Transform2d;
    frame?: Frame;
    shader?: Shader;
}

export class Sprite implements ISprite {

    private drawable: Drawable;
    private readonly state = TglState.getCurrent(this.gl);
    private readonly frame: Frame;
    private readonly bbox: Frame = [0,0,0,0];
    private readonly transform: Transform2d;
    private dirty = true;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions){
        const texture = options.texture;
        const shader = options.shader || Shader2d.getInstance(gl);
        this.frame = options.frame || [ 0, 0, options.texture.width, options.texture.height ];
        this.transform = new Transform2d(options.transform || null)
    
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

    public get boundingBox(){
        if(this.dirty){
            this.calculateBoundingBox();
            this.dirty = false;
        }
        return this.bbox;
    }

    public draw(){
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;

        this.drawable.draw();
    }

    public center(x = true, y = true) {
        if(x)
            this.transform.originX = this.frame[2] / 2;
        if(y)
            this.transform.originY = this.frame[3] / 2;

        this.dirty = true;
        
        return this;
    }

    public moveTo(x: number, y: number) {
        this.transform.x = x;
        this.transform.y = y;
        this.dirty = true;

        return this;
    }

    public move(x: number, y: number) {
        this.transform.x += x;
        this.transform.y += y;
        this.dirty = true;       

        return this;
    }

    public rotateTo(r: number) {
        this.transform.rotation = r;
        this.dirty = true;       

        return this;
    }

    public rotate(r: number) {
        this.transform.rotation += r;
        this.dirty = true;

        return this;
    }

    public scale(x: number, y: number) {
        this.transform.scaleX *= x;
        this.transform.scaleY *= y;
        this.dirty = true;

        return this;
    }

    public scaleTo(x: number, y: number) {
        this.transform.scaleX = x;
        this.transform.scaleY = y;
        this.dirty = true;

        return this;
    }

    public moveOrigin(x: number, y: number){
        this.transform.originX += x;
        this.transform.originY += y;
        this.dirty = true;

        return this;
    }
    
    public moveOriginTo(x: number, y: number){
        this.transform.originX = x;
        this.transform.originY = y;
        this.dirty = true;

        return this;
    }

    private calculateBoundingBox() {
        const a = this.transform.transform(0,0);
        const b = this.transform.transform(this.frame[2],0);
        const c = this.transform.transform(this.frame[2],this.frame[3]);
        const d = this.transform.transform(0,this.frame[3]);

        this.bbox[0] = Math.min(a[0], b[0], c[0], d[0]);
        this.bbox[1] = Math.min(a[1], b[1], c[1], d[1]);        
        this.bbox[2] = Math.max(a[0], b[0], c[0], d[0]) - this.bbox[0];
        this.bbox[3] = Math.max(a[1], b[1], c[1], d[1]) - this.bbox[1];
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