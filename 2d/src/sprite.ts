import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Texture, VertexBuffer, Shader, Drawable, GlDataType } from '@tgl/core';
import { Frame } from './frame';
import { Shader2d } from './main';
import { TglState } from '../../core/src/tgl-state';

export class SpriteOptions {
    texture: Texture;
    transform?: Transform2dCreateOptions | Transform2d;
    frame?: Frame;
    shader?: Shader;
}

export class Sprite {

    private drawable: Drawable;
    private readonly state = TglState.getCurrent(this.gl);
    private readonly frame: Frame;

    public readonly transform: Transform2d;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions){
        const texture = options.texture;
        const shader = options.shader || Shader2d.getInstance(gl);
        this.frame = options.frame || { x: 0, y: 0, w: options.texture.width, h: options.texture.height };
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

    private createBuffer(frame: Frame){
        return new VertexBuffer(this.gl, {
            attributes: [
                { name: 'aPosition', components: 2, type: GlDataType.SHORT },
                { name: 'aTexcoord', components: 2, type: GlDataType.SHORT }
            ],
            data: new Int16Array([
                0, 0, frame.x, frame.y,
                frame.w, frame.h, frame.x + frame.w, frame.y + frame.h,
                frame.w, 0, frame.x + frame.w, frame.y,
                0, frame.h, frame.x, frame.y + frame.h
            ])
        })
    }

    public draw(){
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;

        this.drawable.draw();
    }

    public center(x = true, y = true) {
        if(x)
            this.transform.originX = this.frame.w / 2;
        if(y)
            this.transform.originY = this.frame.h / 2;

        return this;
    }

    public moveTo(x: number, y: number) {
        this.transform.x = x;
        this.transform.y = y;

        return this;
    }

    public move(x: number, y: number) {
        this.transform.x += x;
        this.transform.y += y;

        return this;
    }

    public rotateTo(r: number) {
        this.transform.rotation = r;

        return this;
    }

    public rotate(r: number) {
        this.transform.rotation += r;

        return this;
    }

    public scale(x: number, y: number) {
        this.transform.scaleX *= x;
        this.transform.scaleY *= y;

        return this;
    }

    public scaleTo(x: number, y: number) {
        this.transform.scaleX = x;
        this.transform.scaleY = y;

        return this;
    }


}