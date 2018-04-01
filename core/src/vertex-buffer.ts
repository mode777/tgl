import { GlBufferType, GlDataType, GlBufferUsage } from './constants';

export interface BufferOptions {
    usage?: GlBufferUsage,
    data: number[] | Float32Array | ArrayBuffer,
    size?: number,
    attributes?: AttributeOptions[],
    attribute?: AttributeOptions
}

export interface AttributeOptions {
    name: string;
    components: number,
    type?: GlDataType,
    normalized?: boolean,
}


export interface Attribute {
    name: string,
    components: number,
    dataType: GlDataType,
    normalized: boolean,
    offset: number
}

export class VertexBuffer {
    
    private static _current: WebGLBuffer;   

    private _handle: WebGLBuffer;
    private _vertexSize: number;
    
    public attributes: Attribute[];

    constructor(protected _gl: WebGLRenderingContext, private _options: BufferOptions){
        const data = Object.prototype.toString.call(_options.data) === '[object Array]'
            ? new Float32Array(_options.data)
            : _options.data;

        this._handle = _gl.createBuffer();
        this.bind();
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
        if(VertexBuffer._current !== this._handle){
            this._gl.bindBuffer(GlBufferType.ARRAY_BUFFER, this._handle);
            VertexBuffer._current = this._handle;
        }
    }

    public get vertexSize(){
        return this._vertexSize;
    }

    public subData(offset: number, data: ArrayBufferView | ArrayBuffer){
        this.bind();
        this._gl.bufferSubData(GlBufferType.ARRAY_BUFFER, offset, data);
    }

    public delete(){
        this._gl.deleteBuffer(this._handle);
    }
}