import { GlClearFlags } from './constants/gl-clear-flags';
import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlError } from './constants/gl-error';
import { TglState, vec4 } from './tgl-state';
import { GlBlendMode } from './constants/gl-blend-mode';

export interface TglContextOptions extends WebGLContextAttributes {
    canvas?: HTMLCanvasElement,
    width?: number,
    height?: number
}

export enum BlendMode {
    None,
    Alpha,
    Add,
    Multiply,
    Subtract,
    Screen  
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
        
        if(options.width)
            this.canvas.width = options.width;
        if(options.height)
            this.canvas.height = options.height;

        if(context !== null)
            this.gl = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';         

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

    clear(flags = GlClearFlags.COLOR_BUFFER_BIT, color?: vec4<number>){
        if(color)
            this.state.clearColor(color);

        this.gl.clear(flags);
    }

    setBlendMode(mode: BlendMode){
        if(mode === BlendMode.None)
            this.state.blendingEnabled(false);
        else
            this.state.blendingEnabled(true);

        let func: number = this.gl.FUNC_ADD;
        let srcRGB: number = this.gl.ONE;
        let srcA: number =  this.gl.ONE;
        let dstRGB: number = this.gl.ZERO;
        let dstA: number = this.gl.ZERO;

        switch (mode)
        {
            case BlendMode.Alpha:
                srcRGB = srcA = this.gl.SRC_ALPHA;
                dstRGB = dstA = this.gl.ONE_MINUS_SRC_ALPHA;
                break;
            case BlendMode.Multiply:
                srcRGB = srcA = this.gl.DST_COLOR;
                dstRGB = dstA = this.gl.ZERO;
                break;
            case BlendMode.Subtract:
                func = this.gl.FUNC_REVERSE_SUBTRACT;
            case BlendMode.Add:
                srcRGB = this.gl.ONE;
                srcA = this.gl.ZERO;
                dstRGB = dstA = this.gl.ONE;
                break;        
            case BlendMode.Screen:
                srcRGB = srcA = this.gl.ONE;
                dstRGB = dstA = this.gl.ONE_MINUS_SRC_COLOR;
                break;
            case BlendMode.None:
            default:
                srcRGB = srcA = this.gl.ONE;
                dstRGB = dstA = this.gl.ZERO;
                break;
        }

        this.state.blendEquationRgb(func);
        this.state.blendEquationAlpha(func);
        this.state.blendFuncRgb([srcRGB, dstRGB]);
        this.state.blendFuncAlpha([srcA, dstA]);        
    }

    checkErrors(){
        const error = <GlError>this.gl.getError();
        if(error !== GlError.NO_ERROR){
            throw GlError[error];
        }
    }
}