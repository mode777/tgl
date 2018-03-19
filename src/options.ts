import { GlPixelFormat, GlPixelType, GlMagType, GlMinType, GlWrapMode, GlDataType, GlBufferUsage } from "./constants";

export type TextureImage = ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap

export interface TextureOptions {
    lod?: number,
    format?: GlPixelFormat,
    pixelType?: GlPixelType,
    filterMag?: GlMagType,
    filterMin?: GlMinType,
    wrapX?: GlWrapMode,
    wrapY?: GlWrapMode,
    width?: number,
    height?: number,
    source?: TextureImage | string | ArrayBufferView
}

export const DefaultTextureOptions: TextureOptions = {
    lod: 0,
    format: GlPixelFormat.RGBA,
    pixelType: GlPixelType.UNSIGNED_BYTE,
    filterMag: GlMagType.LINEAR,
    filterMin: GlMinType.LINEAR,
    wrapX: GlWrapMode.REPEAT,
    wrapY: GlWrapMode.REPEAT,
    width: 1,
    height: 1
}

export type UniformValue = WebGLTexture | number | number[] | Float32Array; 

export interface GeometryOptions {
    vertices: number,
    buffers: BufferOptions[],
    indices?: number[] | Uint16Array;
}

export interface BufferOptions {
    usage?: GlBufferUsage,
    data: number[] | Float32Array | ArrayBuffer
    attributes: AttributeOptions[]
}

export interface AttributeOptions {
    name?: string;
    components: number,
    type: GlDataType,
    normalized?: boolean,
}

const myGeo: GeometryOptions = {
    vertices: 3,
    buffers: [{
        data: [
            1,1,1, 1,2,1, 2,1,1, 
            1,1,2, 1,1,1, 2,1,1,
            1,2,1, 1,2,1, 2,1,1],
        attributes: [{
            name: "texcoord",
            components: 3,
            type: GlDataType.FLOAT 
        }]
    }]
}