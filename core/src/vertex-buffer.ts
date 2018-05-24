import { GlBufferUsage } from './constants/gl-buffer-usage';
import { GlDataType } from './constants/gl-data-type';
import { TglState } from './tgl-state';

export interface BufferOptions {
    usage?: GlBufferUsage,
    data: number[] | Float32Array | ArrayBuffer | Uint16Array | Uint8Array | Uint32Array | Int16Array | Int32Array | Int8Array
    attributes: AttributeOptions[]
}

export interface AttributeOptions {
    name: string;
    components: 1 | 2 | 3 | 4,
    type?: GlDataType,
    normalized?: boolean,
    offset?: number
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
    
    private handle: WebGLBuffer;
    private options: BufferOptions;
    private attributesByName: {[key:string]:AttributeInfo} = {};
    private state = TglState.getCurrent(this.gl);

    public readonly vertexSize: number;
    public readonly size: number;
    public readonly attributes: AttributeInfo[];

    constructor(protected gl: WebGLRenderingContext, options: BufferOptions){
        options.data = Object.prototype.toString.call(options.data) === '[object Array]'
            ? new Float32Array(options.data)
            : options.data;

        this.options =  { ...bufferDefaults, ...options };
        
        let offset = 0;
        this.attributes = this.options.attributes
            .map(x => ({ ...attributeDefaults, ...x }))
            .map(x => {
                const attr = {
                    name: x.name,
                    components: x.components,
                    dataType: x.type,
                    normalized: x.normalized,
                    offset: x.offset !== undefined ? x.offset : offset,
                };                
                offset += this.getSize(attr.dataType) * attr.components;
                this.attributesByName[x.name] = attr;
                return attr;
            });
        this.vertexSize = offset;

        const data: any = this.options.data;
        this.size = data.byteLength;
        
        this.handle = gl.createBuffer();
        this.bind();
        this.gl.bufferData(gl.ARRAY_BUFFER, <any>this.options.data, this.options.usage);
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
    
    public get webGlBuffer() {
        return this.handle;
    }

    public bind(){
        this.state.vertexBuffer(this.handle);
    }

    public get vertexCount(){
        return this.size / this.vertexSize;
    }

    public subData(offset: number, data: ArrayBuffer){
        this.bind();
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, data);
    }
    
    public enableAttribute(name:string, location:number){
        this.bind();
        const a = this.attributesByName[name];
        
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(
            location,
            a.components,
            a.dataType,
            a.normalized,
            this.vertexSize,
            a.offset);
    }

    public delete(){
        this.gl.deleteBuffer(this.handle);
    }
}