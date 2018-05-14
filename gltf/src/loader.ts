import { GlTf as IGltf, Mesh as IMesh, Scene as IScene, Node as INode, Buffer as IBuffer, BufferView as IBufferView, Accessor as IAccessor, GlTf } from './gltf';

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

export class Mesh {

}

export class Camera {

}

export class Buffer {

}

export class BufferView {

}

export class Accessor {

}

export class Gltf {
    
    private scenes: Scene[] = [];
    private nodes: Node[] = [];
    private meshes: Mesh[] = [];
    private buffers: Buffer[] = [];
    private bufferViews: BufferView[] = [];
    private accessors: Accessor[] = [];
    
    constructor(private url: string){
        
    }
    
    async load() {
        const gltf = <GlTf> await(await fetch(this.url)).json();
        
    }
}