import { BufferOptions } from './vertex-buffer';
import { GlBufferType, GlBufferUsage, GlDataType } from './constants';
import { Shader } from './main';

export interface GeometryOptions {
    vertices: number,
    buffers: BufferOptions[],
    indices?: number[] | Uint16Array;
    shader: Shader
}

export class Geometry {
    constructor(private _options: GeometryOptions){
    }


}