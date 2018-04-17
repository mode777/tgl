/** Represents an index that is used to determine the 
 * order in which vertices are used to draw primitives.
 * For example, if you have four vertices describing 
 * a rectangle in a clockwise order, you could describe 
 * it's two triangles as `[0,3,2, 0,2,1]`. */
export class IndexBuffer {

    private static _current: WebGLBuffer;
    
    private _handle: WebGLBuffer;
    private _length: number;
    
    /** Creates a new index buffer instance
     * @param _gl A rendering context
     * @param _data If a normal array is passed in, it gets converted to an Uint16Array. 
     * Uint8 Arrays are not supported, as they come with performance caveats. */
    constructor(protected _gl: WebGLRenderingContext, _data: Uint16Array | number[]){
        const data = _data instanceof Uint16Array ? _data : new Uint16Array(_data);
        this._length = data.length;
        this._handle = _gl.createBuffer();
        this.bind();
        this._gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, data, _gl.STATIC_DRAW);
    }
    
    /** Gets the native WebGlBuffer object */
    public get webGlBuffer() {
        return this._handle;
    }

    /** The GL data type of the buffer. Always returns UNSIGNED_SHORT */
    public get type(){
        return this._gl.UNSIGNED_SHORT;
    }
    
    /** Number of indices in the buffer */
    public get length(){
        return this._length;
    }
    
    /** Binds the buffer, if it is not currently bound */
    public bind(){
        if(this._handle !== IndexBuffer._current){
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._handle);        
            IndexBuffer._current = this._handle;
        }
    }

    /** Deletes the buffer */
    public delete(){
        this._gl.deleteBuffer(this._handle);
    }
}