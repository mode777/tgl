export class Renderbuffer {

    private _handle: WebGLRenderbuffer;

    constructor(protected _gl: WebGLRenderingContext){
        this._handle = _gl.createRenderbuffer();
    }

    bind(){
        
    }
}