import { GlBufferType, GlBufferUsage } from './constants';

export class IndexBuffer {

    private static _current: WebGLBuffer;
    
    private _handle: WebGLBuffer;
    private _length: number;
    
    constructor(protected _gl: WebGLRenderingContext, _data: Uint16Array | number){
        const data = _data instanceof Uint16Array ? _data : new Uint16Array(_data);
        this._length = data.length;
        this._handle = _gl.createBuffer();
        this.bind();
        this._gl.bufferData(GlBufferType.ELEMENT_ARRAY_BUFFER, data, GlBufferUsage.STATIC_DRAW);
    }
    
    public get handle() {
        return this._handle;
    }
    
    public get length(){
        return this._length;
    }
    
    public bind(){
        if(this._handle !== IndexBuffer._current){
            this._gl.bindBuffer(GlBufferType.ELEMENT_ARRAY_BUFFER, this._handle);        
            IndexBuffer._current = this._handle;
        }
    }

    public delete(){
        this._gl.deleteBuffer(this._handle);
    }
}