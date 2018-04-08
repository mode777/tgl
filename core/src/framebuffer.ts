import { Texture } from "./texture";
import { GlFramebufferType, GlFramebufferStatus, GlTextureBindType } from "./constants";

export class Framebuffer {
    
    private static _current: WebGLFramebuffer;

    private _handle: WebGLFramebuffer;
    
    constructor(protected _gl: WebGLRenderingContext){
        this._handle = _gl.createFramebuffer();
    }

    bind(){
        if(this._handle !== Framebuffer._current){
            this._gl.bindFramebuffer(GlFramebufferType.FRAMEBUFFER, this._handle);
            Framebuffer._current = this._handle;
        }
    }

    webGlFramebuffer(){
        return this._handle;
    }

    checkStatus(): GlFramebufferStatus {
        throw "Not implemented"
    }

    
    copyToTexture(texture: Texture, x = 0, y = 0, width = texture.width, height = texture.height, level = 0){
        this.bind();
        this._gl.copyTexImage2D(GlTextureBindType.TEXTURE_2D, level, texture.format, x, y, width, height, 0);
    }

    copyToSubTexture(texture: Texture, xoffset = 0, yoffset = 0, x = 0, y = 0, width = texture.width, height = texture.height, level = 0){
        this.bind();
        this._gl.copyTexSubImage2D(GlTextureBindType.TEXTURE_2D, level, xoffset, yoffset, x, y, width, height);
    }
}