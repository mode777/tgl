import { GlTf as IGltf, Mesh as IMesh, Scene as IScene, Node as INode, Buffer as IBuffer, BufferView as IBufferView, Accessor as IAccessor, GlTf } from './gltf';
import { GlDataType, GlBufferType, IndexBuffer, VertexBuffer, BufferOptions, GlBufferUsage, Shader, Drawable } from '@tgl/core'

export class Scene {
    constructor(public readonly nodes: Node[]){

    }
}

export class Transform {

}

export abstract class Node {

    private _parent: Node = null;

    constructor(public readonly children: Node[] = [],  
        public readonly transform: Transform = new Transform){
            children.forEach(x => x._parent = this);
    }

    public get parent() { return parent; }

}

export class MeshNode extends Node {
    constructor(public readonly mesh: Mesh, 
        children: Node[], 
        parent: Node, 
        transform: Transform){
            super(children, transform);
    }
}

export class CameraNode extends Node {
    constructor(camera: Camera, 
        children: Node[],
        transform: Transform){
            super(children, transform);
    }
}

export interface MeshOptions {
    primitives: MeshPrimitive[]
}

export class Mesh {

    public readonly primitives: MeshPrimitive[];

    constructor(options: MeshOptions){
        this.primitives = options.primitives;
    }
}

export interface MeshPrimitiveOptions {
    vertexBuffers: VertexBuffer[];
    indexBuffer?: IndexBuffer;
}

export class MeshPrimitive {

    public readonly vertexBuffers: VertexBuffer[];
    public readonly indexBuffer: IndexBuffer;

    constructor(protected gl: WebGLRenderingContext, options: MeshPrimitiveOptions){
        this.vertexBuffers = options.vertexBuffers;
        this.indexBuffer = options.indexBuffer;
    }

}

export class Camera {

}

export class Buffer {

}


export class GltfLoader {
    
    private scenes: Scene[] = [];
    private nodes: Node[] = [];
    meshes: Mesh[] = [];
    private buffers: ArrayBuffer[] = [];
    
    constructor(private gl: WebGLRenderingContext, private url: string){
        
    }
    
    async load() {
        const gltf = <GlTf> await(await fetch(this.url)).json();
        
        await Promise.all(gltf.buffers.map(async (b, i) => this.buffers[i] = await this.loadBuffer(b)));

        this.meshes = gltf.meshes.map(m => {
            const primitives = (m.primitives || []).map(p => {
                                
                let indexBuffer: IndexBuffer = null;
                if(p.indices !== undefined){
                    const accessor = gltf.accessors[p.indices];
                    const view = gltf.bufferViews[accessor.bufferView];
                    const buffer = this.buffers[view.buffer];

                    indexBuffer = new IndexBuffer(this.gl, new Uint16Array(buffer, view.byteOffset, view.byteLength));
                }

                const attributeMap = Object.keys(p.attributes).reduce<{[key: string]: BufferOptions}>((agg,name) => {
                    const accessor = gltf.accessors[p.attributes[name]];
                    const view = gltf.bufferViews[accessor.bufferView];
                    const buffer = this.buffers[view.buffer];

                    if(!agg[view.buffer])
                        agg[view.buffer] = {
                            data: new Uint8Array(buffer, view.byteOffset, view.byteLength),
                            attributes: []
                        }
                        
                    const bufferOptions = agg[view.buffer];
                    bufferOptions.attributes.push({
                        components: <any>accessor.count,
                        offset: accessor.byteOffset,
                        name: name,
                        type: accessor.componentType
                    });
                    
                    return agg;
                },{})               
                
                return new MeshPrimitive(this.gl, {
                    vertexBuffers: Object.keys(attributeMap).map(x => new VertexBuffer(this.gl, attributeMap[x])),
                    indexBuffer: indexBuffer
                });
            });

            return new Mesh({ primitives: primitives });             
        });
    }

    private async loadBuffer(buffer: IBuffer){
        if(!buffer.uri)
            throw 'Unable to load buffer without "uri"';
    
        if( isDataUri(buffer.uri)){
            const bytes = new Uint8Array(buffer.byteLength);
            const binaryString = atob(buffer.uri.split(',')[1]);            
            for(var i = 0; i < binaryString.length; i++){
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
        else {
            // todo: load buffer from file
            throw 'Not implemented';
        }
    }
    
        
}

function isDataUri(s: string) {
    return s.startsWith('data:')
}


