import { GlBufferType, GlDataType, GlBufferUsage } from './constants';

export interface BufferOptions {
    usage?: GlBufferUsage,
    data: number[] | Float32Array | ArrayBuffer,
    attributes: AttributeOptions[]
}

export interface AttributeOptions {
    name: string;
    components: 1 | 2 | 3 | 4,
    type?: GlDataType,
    normalized?: boolean,
}

export interface AttributeInfo {
    name: string,
    components: number,
    dataType: GlDataType,
    normalized: boolean,
    offset: number
}

const bufferDefaults = {
    usage: GlBufferUsage.STATIC_DRAW,
    attributes: []
}

const attributeDefaults = {
    type: GlDataType.FLOAT,
    normalized: false
}

export class VertexBuffer {
    
    private static _current: WebGLBuffer;   

    private _handle: WebGLBuffer;
    private _vertexSize: number;
    private _size: number;
    private _options: BufferOptions;
    
    public attributes: AttributeInfo[];

    constructor(protected _gl: WebGLRenderingContext, options: BufferOptions){
        options.data = Object.prototype.toString.call(options.data) === '[object Array]'
            ? new Float32Array(options.data)
            : options.data;

        this._options =  { ...bufferDefaults, ...options };
        
        let offset = 0;
        this.attributes = this._options.attributes
            .map(x => ({ ...attributeDefaults, ...x }))
            .map(x => {
                const attr = {
                    name: x.name,
                    components: x.components,
                    dataType: x.type,
                    normalized: x.normalized,
                    offset: offset
                };                
                offset += this.getSize(attr.dataType) * attr.components;
                return attr;
            });
        this._vertexSize = offset;

        const data: any = this._options.data;
        this._size = data.buffer ? data.buffer.byteLength : data.byteLength;
        
        this._handle = _gl.createBuffer();
        this.bind();
        this._gl.bufferData(GlBufferType.ARRAY_BUFFER, <any>this._options.data, this._options.usage);
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
        if(VertexBuffer._current !== this._handle){
            this._gl.bindBuffer(GlBufferType.ARRAY_BUFFER, this._handle);
            VertexBuffer._current = this._handle;
        }
    }

    public get vertexSize(){
        return this._vertexSize;
    }

    public get size(){
        return this._size;
    }

    public get vertexCount(){
        return this._size / this._vertexSize;
    }

    public subData(offset: number, data: ArrayBuffer){
        this.bind();
        this._gl.bufferSubData(GlBufferType.ARRAY_BUFFER, offset, data);
    }

    public delete(){
        this._gl.deleteBuffer(this._handle);
    }
}