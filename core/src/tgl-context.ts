import { GlClearFlags } from './constants/gl-clear-flags';
import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlError } from './constants/gl-error';
import { TglState } from './tgl-state';

const defaultOptions: WebGLContextAttributes = {
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

    constructor(public readonly canvas: HTMLCanvasElement, options?: WebGLContextAttributes){

        const context = this.canvas.getContext('webgl', { ...defaultOptions, ...options });         
        
        if(context !== null)
            this.gl = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';  
            
        this.state = TglState.getCurrent(this.gl);
    }

    get webGlRenderingContext(){
        return this.gl;
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