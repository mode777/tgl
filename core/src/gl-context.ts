import { GlClearFlags } from "./constants";

export class GlContext {
    private _handle: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes){
        this._canvas = canvas;

        const context = this._canvas.getContext('webgl', options);         
        
        if(context !== null)
            this._handle = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';
    }

    get handle(){
        return this._handle;
    }

    get canvas(){
        return this._canvas;
    }

    clear(flags = GlClearFlags.COLOR_BUFFER_BIT, r?: number, g = 0, b = 0, a = 1){
        if(r != undefined)
            this._handle.clearColor(r,g,b,a);
        
        this._handle.clear(flags);
    }
}