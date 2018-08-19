import { TglContext } from './tgl-context';

/** Represents an index that is used to determine the 
 * order in which vertices are used to draw primitives.
 * For example, if you have four vertices describing 
 * a rectangle in a clockwise order, you could describe 
 * it's two triangles as `[0,3,2, 0,2,1]`. */
export class IndexBuffer {    

    private handle: WebGLBuffer;
    private gl = this.context.webGlRenderingContext;
    private state = this.context.state;

    /** Number of indices in the buffer */    
    readonly length: number;
        
    /** Creates a new index buffer instance
     * @param context A tgl context
     * @param data If a normal array is passed in, it gets converted to an Uint16Array. 
     * Uint8 Arrays are not supported, as they come with performance caveats. */
    constructor(protected context: TglContext, data: Uint16Array | number[]){
        const dataNorm = data instanceof Uint16Array ? data : new Uint16Array(data);
        this.length = data.length;
        this.handle = this.gl.createBuffer();
        this.bind();
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, dataNorm, this.gl.STATIC_DRAW);
    }
    
    /** Gets the native WebGlBuffer object */
    public get webGlBuffer() {
        return this.handle;
    }

    /** The GL data type of the buffer. Always returns UNSIGNED_SHORT */
    public get type(){
        return this.gl.UNSIGNED_SHORT;
    }
    
    
    /** Binds the buffer, if it is not currently bound */
    public bind(){
        this.state.indexBuffer(this.handle);
    }

    /** Deletes the buffer */
    public delete(){
        this.gl.deleteBuffer(this.handle);
    }
}