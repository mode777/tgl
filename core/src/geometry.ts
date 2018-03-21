import { GeometryOptions, BufferOptions } from './options';
import { GlContext } from './gl-context';
import { GlBufferType, GlBufferUsage, GlDataType } from './constants';

export interface Attribute {
    name: string,
    components: number,
    dataType: GlDataType,
    normalized: boolean,
    offset: number
}

export class ArrayBuffer {
    
    private _handle: WebGLBuffer;
    private _vertexSize: number;
    
    public attributes: Attribute[];

    constructor(protected _gl: WebGLRenderingContext, private _options: BufferOptions){
        const data = Object.prototype.toString.call(_options.data) === '[object Array]'
            ? new Float32Array(_options.data)
            : _options.data;

        this._handle = _gl.createBuffer();
        this._gl.bindBuffer(GlBufferType.ARRAY_BUFFER, this._handle);
        this._gl.bufferData(GlBufferType.ARRAY_BUFFER, <any>data, _options.usage);

        let offset = 0;
        this.attributes = _options.attributes.map(x => {
            const attr = {
                name: x.name,
                components: x.components,
                dataType: x.type,
                normalized: x.normalized,
                offset: offset
            };
            offset += this.getSize(this.getSize(attr.dataType) * attr.components);
            return attr;
        })
        this._vertexSize = offset;
    }


    private getSize(type: GlDataType){
        switch (type) {
            case GlDataType.BYTE:
            case GlDataType.UNSIGNED_BYTE:
                return 1;
            case GlDataType.FLOAT:
            case GlDataType.INT:
            case GlDataType.UNSIGNED_INT:
                return 4;
            case GlDataType.SHORT:
            case GlDataType.UNSIGNED_SHORT:
                return 2;
        }
    }
    
    public get handle() {
        return this._handle;
    }

    public bind(){
        this._gl.bindBuffer(GlBufferType.ARRAY_BUFFER, this._handle);        
    }

    public get vertexSize(){
        return this._vertexSize;
    }
}

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

export class Geometry {
    constructor(private _options: GeometryOptions){
    }


}