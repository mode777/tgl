import { GlMinType } from './constants/gl-min-type';
import { GlMagType } from './constants/gl-mag-type';
import { GlWrapMode } from './constants/gl-wrap-mode';
import { GlPixelFormat } from './constants/gl-pixel-format';
import { GlPixelType } from './constants/gl-pixel-type';

export interface TextureOptions {
    source?: TextureImage | ArrayBufferView,
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

    private static _bound: WebGLTexture[] = [];
    private static _active = 0;
    private static _maxUnits = -1;

    public static bind(gl: WebGLRenderingContext, texture: WebGLTexture, unit?: number){
        if(unit !== undefined){
            if(unit >= Texture._maxUnits){
                throw `Cannot bind texture unit ${unit}. System maximum is ${Texture._maxUnits-1}.`;
            }
    
            if(unit != Texture._active){
                gl.activeTexture(unit + gl.TEXTURE0);
                Texture._active = unit;
            }
        }

        if(texture !== Texture._bound[Texture._active]){
            gl.bindTexture(gl.TEXTURE_2D, texture);
            Texture._bound[Texture._active] = texture;
        }

        return Texture._active;
    }
    
    public static async fromFile(gl: WebGLRenderingContext, url: string, options: Partial<TextureOptions> = {}){
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
    private _width: number;
    private _height: number;
    protected _options: TextureOptions;


    constructor(protected _gl: WebGLRenderingContext, options: TextureOptions) {
        if(Texture._maxUnits === -1)
            Texture._maxUnits = _gl.getParameter(_gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        
        this._options =  { ...DefaultTextureOptions, ...options };
        this._handle = this._gl.createTexture();
        
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
        else {
            // no data
            this.createEmpty(this._options.width, this._options.height);
        }
        
        this.bind();
        if(this._options.generateMipmaps){
            _gl.generateMipmap(_gl.TEXTURE_2D);
        }
        this.setFilter(this._options.filterMin, this._options.filterMag);
        this.setWrapping(this._options.wrapX, this._options.wrapY);
    }

    get webGlTexture() {
        return this._handle;
    }

    get format() {
        return this._options.format;
    }

    get width(){
        return this._width;
    }

    get height(){
        return this._height;
    }

    public bind(unit?: number) {

        if(unit !== undefined){
            if(unit >= Texture._maxUnits){
                throw `Cannot bind texture unit ${unit}. System maximum is ${Texture._maxUnits-1}.`;
            }
    
            if(unit != Texture._active){
                this._gl.activeTexture(unit + this._gl.TEXTURE0);
                Texture._active = unit;
            }
        }

        if(this._handle !== Texture._bound[Texture._active]){
            this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
            Texture._bound[Texture._active] = this._handle;
        }

        return Texture._active;
    }

    public setFilter(min: GlMinType, mag: GlMagType) {
        this.bind();
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, min);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, mag);
    }

    public setWrapping(s: GlWrapMode, t: GlWrapMode) {
        this.bind();
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, s);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, t);
    }
    
    private createFromImage(data: TextureImage) {
        this._width = data.width;
        this._height = data.height;
        
        this.bind();
        
        this._gl.texImage2D(
            this._gl.TEXTURE_2D,
            this._options.lod,
            this._options.format,
            this._options.format,
            this._options.pixelType,
            data);
    }    
    
    private createFromData(data: ArrayBufferView, width?: number, height?: number) {
        this._width = width || this._options.width;
        this._height = height || this._options.height;

        this.bind();
        this._gl.texImage2D(
            this._gl.TEXTURE_2D, 
            this._options.lod, 
            this._options.format, 
            this._width, 
            this._height, 
            0, 
            this._options.format, 
            this._options.pixelType, 
            data);
    }

    createEmpty(width: number, height: number) {
        console.log(width, height)
        this.bind();
        this._gl.texImage2D(
            this._gl.TEXTURE_2D, 
            this._options.lod, 
            this._options.format, 
            this._width, 
            this._height, 
            0, 
            this._options.format, 
            this._options.pixelType, 
            null);
    }
}