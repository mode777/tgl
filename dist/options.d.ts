import { GlPixelFormat, GlPixelType } from "./constants";
export interface TextureOptions {
    lod?: number;
    format?: GlPixelFormat;
    pixelType?: GlPixelType;
}
export declare const DefaultTextureOptions: TextureOptions;
