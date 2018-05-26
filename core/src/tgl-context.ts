import { GlClearFlags } from './constants/gl-clear-flags';
import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlError } from './constants/gl-error';
import { TglState, vec4 } from './tgl-state';

export interface TglContextOptions extends WebGLContextAttributes {
    canvas?: HTMLCanvasElement,
    width?: number,
    height?: number
}

const defaultOptions: TglContextOptions = {
    width: 320,
    height: 240,
    alpha: false,
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
    premultipliedAlpha: false,
    stencil: false,
    preserveDrawingBuffer: false
}

export class TglContext {
        
    private gl: WebGLRenderingContext;
    private elementArrayBuffer: WebGLBuffer;

    readonly state: TglState;
    readonly canvas: HTMLCanvasElement;

    constructor(options: TglContextOptions = {}){
        this.canvas = options.canvas || document.createElement('canvas');
        const context = <WebGLRenderingContext>this.canvas.getContext('webgl', { ...defaultOptions, ...options });      
        
        if(context !== null)
            this.gl = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';  
        
        if(options.width)
            this.canvas.width = options.width;
        if(options.height)
            this.canvas.height = options.height;

        this.state = TglState.getCurrent(this.gl);
        this.resize();
    }

    get webGlRenderingContext(){
        return this.gl;
    }

    resize(){
        const nvp: vec4<number> = [0,0,this.canvas.width, this.canvas.height];
        const vp = this.state.viewport();
        if(vp[0] !== nvp[0] || vp[1] !== nvp[1] || vp[2] !== nvp[2] || vp[3] !== nvp[3]){
            this.state.viewport(nvp)
        }
    }

    clear(flags = GlClearFlags.COLOR_BUFFER_BIT){
        this.gl.clear(flags);
    }

    checkErrors(){
        const error = <GlError>this.gl.getError();
        if(error !== GlError.NO_ERROR){
            throw GlError[error];
        }
    }
}