import { GlMinType } from './constants/gl-min-type';
import { GlMagType } from './constants/gl-mag-type';
import { GlWrapMode } from './constants/gl-wrap-mode';
import { GlPixelFormat } from './constants/gl-pixel-format';
import { GlPixelType } from './constants/gl-pixel-type';
import { TglState } from './tgl-state';

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
    
    public static async fromFile(gl: WebGLRenderingContext, url: string, options: Partial<TextureOptions> = {}){
        return new Promise<Texture>((res, rej) => {
            const img = new Image();            
            img.src = url;
            options.source = img;            
            
            img.onerror = (e) => rej(e);
            img.onload = () => res(new Texture(gl, <TextureOptions>options));
        });
    }

    private handle: WebGLTexture;
    private state = TglState.getCurrent(this.gl);

    protected options: TextureOptions;
    
    public readonly width: number;
    public readonly height: number;
    
    constructor(protected gl: WebGLRenderingContext, options: TextureOptions) {
        
        this.options =  { ...DefaultTextureOptions, ...options };
        this.handle = this.gl.createTexture();
        this.bind();
        this.gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        if(this.options.source){
            // is typed array
            if(this.options.source['buffer']){
                if(!this.options.width || !this.options.height)
                    throw 'If source is a typed array, you have to supply "width" and "height"';
                
                this.width = this.options.width;
                this.height = this.options.height;
                this.createFromData(<ArrayBufferView>this.options.source);
                
            }
            // is HtmlImageElement
            else if(this.options.source) {
                const img = <TextureImage>this.options.source;
                this.width = img.width;
                this.height = img.height;
                this.createFromImage(img);
            }
        }
        else {
            // no data
            this.width = this.options.width;
            this.height = this.options.height;
            this.createEmpty();
        }
        
        this.bind();
        if(this.options.generateMipmaps){
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        this.setFilter(this.options.filterMin, this.options.filterMag);
        this.setWrapping(this.options.wrapX, this.options.wrapY);
    }

    get webGlTexture() {
        return this.handle;
    }

    get format() {
        return this.options.format;
    }

    public bind(unit?: number) {
        if(unit !== undefined)
            this.state.activeTexture(unit);
        
        this.state.texture(this.handle);
        
        return this.state.activeTexture();
    }

    public setFilter(min: GlMinType, mag: GlMagType) {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, min);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, mag);
    }

    public setWrapping(s: GlWrapMode, t: GlWrapMode) {
        this.bind();
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, s);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, t);
    }
    
    private createFromImage(data: TextureImage) {       
        this.bind();
        
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            this.options.lod,
            this.options.format,
            this.options.format,
            this.options.pixelType,
            data);
    }    
    
    private createFromData(data: ArrayBufferView) {
        this.bind();
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 
            this.options.lod, 
            this.options.format, 
            this.width, 
            this.height, 
            0, 
            this.options.format, 
            this.options.pixelType, 
            data);
    }

    createEmpty() {
        this.bind();
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 
            this.options.lod, 
            this.options.format, 
            this.width, 
            this.height, 
            0, 
            this.options.format, 
            this.options.pixelType, 
            null);
    }
}