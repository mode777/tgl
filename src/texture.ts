import { GlContext } from "./gl-context";
import { GlTexture, GlTextureCreateType, GlPixelFormat, GlPixelType } from "./constants";
import merge from 'deepmerge'
import { TextureOptions, DefaultTextureOptions } from "./options";

export type TextureSource = ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap

export class Texture {
    
    private _handle = 0;
    private _gl: WebGLRenderingContext = GlContext.getCurrent().handle;
    private _options: TextureOptions;

    constructor(source: TextureSource | string, options: TextureOptions = {}){
        this._options = merge(DefaultTextureOptions, options);
        let data: TextureSource;
        if(typeof(source) === 'string'){
            const img = new HTMLImageElement();
            img.src = source;
            data = img;
        }
        else {
            data = source;
        }
        this.create(data);
    }

    get handle() {
        return this._handle;
    }

    private create(data: TextureSource){
        this._gl.texImage2D(
            GlTextureCreateType.TEXTURE_2D, 
            this._options.lod, 
            this._options.format, 
            this._options.format, 
            this._options.pixelType, 
            data);
    }


}