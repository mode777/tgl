import { GlPixelFormat, GlPixelType } from "./constants";

export interface TextureOptions {
    lod?: number,
    format?: GlPixelFormat,
    pixelType?: GlPixelType
}

export const DefaultTextureOptions: TextureOptions = {
    lod: 0,
    format: GlPixelFormat.RGBA,
    pixelType: GlPixelType.UNSIGNED_BYTE
}