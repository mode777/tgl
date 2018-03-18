import { GlClearFlags } from "./constants";

export class GlContext {
    private static _current: GlContext | null = null;
    
    static getCurrent(): GlContext {
        if(GlContext._current === null)
            throw 'No GlContext available';
        else
            return GlContext._current;
    }

    private _handle: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes){
        if(!canvas)
            throw 'Web GL context was already created.'

        this._canvas = canvas;

        const context = this._canvas.getContext('webgl', options); 
        
        if(context !== null)
            this._handle = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';
       
        GlContext._current = this;
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