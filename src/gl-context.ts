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

    clear(flags:GlClearFlags = GlClearFlags.COLOR_BUFFER_BIT, r?: number, g?: number, b?: number, a?: number){
        if(r && g && b)
            this._handle.clearColor(r,g,b, a || 1);

        this._handle.clear(flags);
    }
}