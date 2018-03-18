import { GlContext } from "./gl-context";
import { GlTexture, GlTextureCreateType, GlPixelFormat, GlPixelType, GlTextureParameter, GlMagType, GlMinType, GlWrapMode } from "./constants";
import merge from 'deepmerge'
import { TextureOptions, DefaultTextureOptions, TextureImage } from "./options";


export class Texture {

    private _handle: WebGLTexture;
    protected _gl: WebGLRenderingContext = GlContext.getCurrent().handle;
    protected _options: TextureOptions;

    constructor(options: TextureOptions = {}) {
        this._options = merge(DefaultTextureOptions, options);
        this._handle = this._gl.createTexture();
        
        if(this._options.source){
            let data: TextureImage | ArrayBufferView;
            if(typeof(this._options.source) === 'string'){
                const img = new HTMLImageElement();
                img.src = this._options.source;
                data = img;
            }
            else if(this._options.source['buffer']){
                this.setData(<ArrayBufferView>this._options.source, this._options.width, this._options.height);
            }
            else {
                this.setImage(<TextureImage>this._options.source)
            }
        }

        this.setFilter(this._options.filterMin, this._options.filterMag);
        this.setWrapping(this._options.wrapX, this._options.wrapY);
    }

    get handle() {
        return this._handle;
    }

    public bind() {
        this._gl.bindTexture(GlTextureCreateType.TEXTURE_2D, this._handle);
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