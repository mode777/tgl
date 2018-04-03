import { GlTexture, GlTextureCreateType, GlPixelFormat, GlPixelType, GlTextureParameter, GlMagType, GlMinType, GlWrapMode, GlTextureBindType, GlParam } from "./constants";
import { Framebuffer } from "./framebuffer";

export interface TextureOptions {
    source: TextureImage | ArrayBufferView,
    lod?: number,
    format?: GlPixelFormat,
    pixelType?: GlPixelType,
    filterMag?: GlMagType,
    filterMin?: GlMinType,
    wrapX?: GlWrapMode,
    wrapY?: GlWrapMode,
    width?: number,
    height?: number,
    generateMipmaps?: boolean
}

export type TextureImage = ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap

const DefaultTextureOptions = {
    lod: 0,
    format: GlPixelFormat.RGBA,
    pixelType: GlPixelType.UNSIGNED_BYTE,
    filterMag: GlMagType.LINEAR,
    filterMin: GlMinType.LINEAR,
    wrapX: GlWrapMode.REPEAT,
    wrapY: GlWrapMode.REPEAT,
    width: 1,
    height: 1,
    generateMipmaps: false
}

export class Texture {

    private static _bound: WebGLTexture;
    private static _units: Texture[] = [];
    private static _unitLookup: {[key: number]: number}
    private static _combinedUnits = 0;
    private static _refCtr = 0;

    // public static fromFramebuffer(framebuffer: Framebuffer, x = 0, y = 0, width = texture.width, height = texture.height, level = 0){
    //     // TODO: Implement
    //     framebuffer.bind();
    //     this._gl.copyTexImage2D(GlTextureBindType.TEXTURE_2D, level, texture.format, x, y, width, height, 0);
    // }

    public static async fromFile(gl: WebGLRenderingContext, url: string, options: Partial<TextureOptions>){
        return new Promise<Texture>((res, rej) => {
            const img = new Image();            
            img.src = url;
            options.source = img;            
            
            img.onerror = (e) => rej(e);
            img.onload = () => res(new Texture(gl, <TextureOptions>options));
        });
    }

    private _handle: WebGLTexture;
    private _ref: number;
    protected _options: TextureOptions;

    constructor(protected _gl: WebGLRenderingContext, options: TextureOptions) {
        if(Texture._combinedUnits === 0)
            Texture._combinedUnits = _gl.getParameter(GlParam.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        
        this._options =  { ...DefaultTextureOptions, ...options };
        this._handle = this._gl.createTexture();
        this._ref = ++Texture._refCtr;
        
        if(this._options.source){
            // is typed array
            if(this._options.source['buffer']){
                if(!this._options.width || !this._options.height)
                    throw 'If source is a typed array, you have to supply "width" and "height"';
                this.createFromData(<ArrayBufferView>this._options.source, this._options.width, this._options.height);
            }
            // is HtmlImageElement
            else if(this._options.source) {
                this.createFromImage(<TextureImage>this._options.source)
            }
        }
        
        this.bind();
        if(this._options.generateMipmaps){
            _gl.generateMipmap(GlTextureBindType.TEXTURE_2D);
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
        if(this._handle !== Texture._bound){
            this._gl.bindTexture(GlTextureCreateType.TEXTURE_2D, this._handle);
            Texture._bound = this._handle;
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

    public activate(unit?: GlTexture){
        // TODO!

        // if(!unit && Texture._unitLookup[this._ref]){

        // }
        
        // if(unit){
        //     const idx = unit - GlTexture.TEXTURE0;
        //     if(Texture._units[idx]){
        //         Texture._unitLookup[Texture._units[idx]._ref] = null;
        //     }
        //     Texture._units[idx] = this;
        //     Texture._unitLookup[this._ref] = idx;
        // }
        // else {

        // }
    }

    private createFromImage(data: TextureImage) {
        this.bind();
        this._gl.texImage2D(
            GlTextureCreateType.TEXTURE_2D,
            this._options.lod,
            this._options.format,
            this._options.format,
            this._options.pixelType,
            data);
    }    
    
    private createFromData(data: ArrayBufferView, width?: number, height?: number) {
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