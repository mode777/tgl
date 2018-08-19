import { TglContext } from './tgl-context';
import { GlRenderbufferFormat } from './constants/gl-renderbuffer-format';

export interface RenderbufferOptions {
    width: number,
    height: number,
    format?: GlRenderbufferFormat
}

const defaultOptions = {
    format: GlRenderbufferFormat.DEPTH_COMPONENT16
}

export class Renderbuffer {

    private state = this.context.state;
    private gl = this.context.webGlRenderingContext;
    
    readonly width: number;
    readonly height: number;
    readonly webGlRenderbuffer: WebGLRenderbuffer;
    readonly format: GlRenderbufferFormat;

    constructor(protected context: TglContext, options: RenderbufferOptions){
        this.width = options.width;
        this.height = options.height;
        this.format = options.format || defaultOptions.format;
        
        this.webGlRenderbuffer = this.gl.createRenderbuffer();
        this.bind();
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.format, this.width, this.height);
    }

    bind(){
        this.state.renderbuffer(this.webGlRenderbuffer);        
    }
}