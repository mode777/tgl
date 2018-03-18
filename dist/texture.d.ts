import { TextureOptions } from "./options";
export declare type TextureSource = ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap;
export declare class Texture {
    private _handle;
    private _gl;
    private _options;
    constructor(source: TextureSource | string, options?: TextureOptions);
    readonly handle: number;
    private create(data);
}
