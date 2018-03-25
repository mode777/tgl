import { GlBufferType, GlBufferUsage } from './constants';

export class IndexBuffer {
    
    private _handle: WebGLBuffer;
    private _length: number;
    
    constructor(protected _gl: WebGLRenderingContext, _data: Uint16Array | number){
        const data = _data instanceof Uint16Array ? _data : new Uint16Array(_data);
        this._length = data.length;
        this._handle = _gl.createBuffer();
        this._gl.bindBuffer(GlBufferType.ELEMENT_ARRAY_BUFFER, this._handle);
        this._gl.bufferData(GlBufferType.ELEMENT_ARRAY_BUFFER, data, GlBufferUsage.STATIC_DRAW);
    }
    
    public get handle() {
        return this._handle;
    }
    
    public get length(){
        return this._length;
    }
    
    public bind(){
        this._gl.bindBuffer(GlBufferType.ELEMENT_ARRAY_BUFFER, this._handle);        
    }
}