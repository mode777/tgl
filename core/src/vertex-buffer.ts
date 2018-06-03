import { GlBufferUsage } from './constants/gl-buffer-usage';
import { GlDataType } from './constants/gl-data-type';
import { TglState } from './tgl-state';

export type BufferData = Float32Array | ArrayBuffer | Uint16Array | Uint8Array | Uint32Array | Int16Array | Int32Array | Int8Array;

export interface BufferOptions {
    usage?: GlBufferUsage,
    data: BufferData | number[]
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
    private attributesByName: {[key:string]:AttributeInfo} = {};
    private state = TglState.getCurrent(this.gl);

    public readonly vertexSize: number;
    public readonly size: number;
    public readonly attributes: AttributeInfo[];
    public readonly usage: GlBufferUsage;

    constructor(protected gl: WebGLRenderingContext, options: BufferOptions){
        options.data = this.getData(options.data, options.attributes[0].type)

        const opt =  { ...bufferDefaults, ...options };

        this.usage = opt.usage;
        
        let offset = 0;
        this.attributes = opt.attributes
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

        const data: any = opt.data;
        this.size = data.byteLength;
        
        this.handle = gl.createBuffer();

        this.data(<any>opt.data);
    }

    private getData(data: BufferData | number[], type: GlDataType = GlDataType.FLOAT): BufferData{
        const isNumbers =  Object.prototype.toString.call(data) === '[object Array]'
        if(isNumbers){
            switch (type) {
                case GlDataType.BYTE:
                    return new Int8Array(data);
                case GlDataType.UNSIGNED_BYTE:
                    return new Uint8Array(data);
                case GlDataType.SHORT:
                    return new Int16Array(data);
                case GlDataType.UNSIGNED_SHORT:
                    return new Uint16Array(data);
                case GlDataType.INT:
                    return new Int32Array(data);
                case GlDataType.UNSIGNED_INT:
                    return new Uint32Array(data);
                case GlDataType.FLOAT:
                    return new Float32Array(data);
                default:
                    throw 'Unknown data type: ' + type;
            }
        }
        else {
            return <BufferData>data;
        }
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

    public subData(offset: number, data: BufferData){
        this.bind();
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, offset, data);
    }

    public data(data: BufferData){
        this.bind();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.usage);        
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