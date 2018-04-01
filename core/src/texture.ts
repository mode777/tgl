import { GlTexture, GlTextureCreateType, GlPixelFormat, GlPixelType, GlTextureParameter, GlMagType, GlMinType, GlWrapMode, GlTextureBindType } from "./constants";
import { Framebuffer } from "./framebuffer";

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
    source?: TextureImage | string | ArrayBufferView,
    generateMipmaps?: boolean
}

export type TextureImage = ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap

const DefaultTextureOptions: TextureOptions = {
    lod: 0,
    format: GlPixelFormat.RGBA,
    pixelType: GlPixelType.UNSIGNED_BYTE,
    filterMag: GlMagType.LINEAR,
    filterMin: GlMinType.LINEAR,
    wrapX: GlWrapMode.REPEAT,
    wrapY: GlWrapMode.REPEAT,
    width: 1,
    height: 1,
    generateMipmaps: true
}

export class Texture {

    private static _current: WebGLTexture;

    // public static fromFramebuffer(framebuffer: Framebuffer, x = 0, y = 0, width = texture.width, height = texture.height, level = 0){
    //     // TODO: Implement
    //     framebuffer.bind();
    //     this._gl.copyTexImage2D(GlTextureBindType.TEXTURE_2D, level, texture.format, x, y, width, height, 0);
    // }

    private _handle: WebGLTexture;
    protected _options: TextureOptions;

    constructor(protected _gl: WebGLRenderingContext, options: TextureOptions = {}) {
        this._options =  { ...DefaultTextureOptions, ...options };
        this._handle = this._gl.createTexture();
        
        if(this._options.source){
            let data: TextureImage | ArrayBufferView;
            
            // is image url
            if(typeof(this._options.source) === 'string'){
                const img = new HTMLImageElement();
                img.src = this._options.source;
                data = img;
            }
            // is typed array
            else if(this._options.source['buffer']){
                if(!this._options.width || !this._options.height)
                    throw 'If source is a typed array, you have to supply "width" and "height"';
                this.setData(<ArrayBufferView>this._options.source, this._options.width, this._options.height);
            }
            // is HtmlImageElement
            else if(this._options.source) {
                this.setImage(<TextureImage>this._options.source)
            }
            else {
                this.bind();
                console.warn('You have created an empty texture')
            }
        }

        this.setFilter(this._options.filterMin, this._options.filterMag);
        this.setWrapping(this._options.wrapX, this._options.wrapY);
    }

    get handle() {
        return this._handle;
    }

    get format() {
        return this._options.format;
    }

    get width(){
        return this._options.width;
    }

    get height(){
        return this._options.height;
    }

    public bind() {
        if(this._handle !== Texture._current){
            this._gl.bindTexture(GlTextureCreateType.TEXTURE_2D, this._handle);
            Texture._current = this._handle;
        }
    }

    public setFilter(min: GlMinType, mag: GlMagType) {
        this.bind();
        this._gl.texParameteri(GlTextureCreateType.TEXTURE_2D, GlTextureParameter.TEXTURE_MIN_FILTER, min);
        this._gl.texParameteri(GlTextureCreateType.TEXTURE_2D, GlTextureParameter.TEXTURE_MAG_FILTER, mag);
    }

    public setWrapping(s: GlWrapMode, t: GlWrapMode) {
        this.bind();
        this._gl.texParameteri(GlTextureCreateType.TEXTURE_2D, GlTextureParameter.TEXTURE_WRAP_S, s);
        this._gl.texParameteri(GlTextureCreateType.TEXTURE_2D, GlTextureParameter.TEXTURE_WRAP_T, t);
    }

    public setImage(data: TextureImage) {
        this.bind();
        this._gl.texImage2D(
            GlTextureCreateType.TEXTURE_2D,
            this._options.lod,
            this._options.format,
            this._options.format,
            this._options.pixelType,
            data);
    }

    

    public setData(data: ArrayBufferView, width?: number, height?: number) {
        width = width || this._options.width;
        height = height || this._options.height;

        this.bind();
        this._gl.texImage2D(
            GlTextureCreateType.TEXTURE_2D, 
            this._options.lod, 
            this._options.format, 
            width, height, 
            0, 
            this._options.format, 
            this._options.pixelType, 
            data);
    }
}