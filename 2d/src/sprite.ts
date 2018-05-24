import { Transform2dCreateOptions, Transform2d } from './transform-2d';
import { Texture, VertexBuffer, Shader, Drawable } from '@tgl/core';
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
    
    public readonly transform: Transform2d;

    constructor(protected gl: WebGLRenderingContext, options: SpriteOptions | Texture){
        let texture: Texture;
        let frame: Frame;
        let shader: Shader;
        
        if(options instanceof Texture){
            texture = options;
            frame = { x: 0, y: 0, w: options.width, h: options.height },
            shader = Shader2d.getInstance(gl);
            this.transform = new Transform2d();
        }
        else {
            texture = options.texture;
            frame = options.frame || { x: 0, y: 0, w: options.texture.width, h: options.texture.height };
            shader = options.shader || Shader2d.getInstance(gl);
            this.transform = new Transform2d(options.transform || null)
        }

        this.drawable = new Drawable(gl, {
            shader: shader,
            textures: { 'uTexture': texture },
            buffers: [this.createBuffer(frame)],
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
                frame.w, frame.h, frame.x + frame.w,
                frame.w, 0, frame.y + frame.h, frame.x + frame.w,
                0, frame.h, frame.y, frame.x, frame.y + frame.h
            ])
        })
    }

    private draw(){
        this.drawable.uniforms['uProject'] = Shader2d.getProjectionMatrix(this.state.viewport());
        this.drawable.uniforms['uTransform'] = this.transform.matrix;

        this.drawable.draw();
    }
}