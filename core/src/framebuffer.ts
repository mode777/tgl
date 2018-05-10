import { GlFramebufferStatus } from './constants/gl-framebuffer-status';

export interface FramebufferOptions {
    colorAttachment?: WebGLTexture | WebGLRenderbuffer,
    depthAttachment?: WebGLTexture | WebGLRenderbuffer,
    stencilAttachment?: WebGLTexture | WebGLRenderbuffer
}

export class Framebuffer {
    
    private static _current: WebGLFramebuffer;

    public static bindDefaultFramebuffer(gl: WebGLRenderingContext){
        if(this._current){
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this._current = null;
        }
    }

    private _handle: WebGLFramebuffer;
    
    constructor(protected _gl: WebGLRenderingContext, options: FramebufferOptions = {}){
        this._handle = _gl.createFramebuffer();
        if(options.colorAttachment instanceof WebGLTexture)
            this.attachTexture(_gl.COLOR_ATTACHMENT0, options.colorAttachment);
        else if(options.colorAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(_gl.COLOR_ATTACHMENT0, options.colorAttachment)
        
        if(options.depthAttachment instanceof WebGLTexture)
            this.attachTexture(_gl.DEPTH_ATTACHMENT, options.depthAttachment);
        else if(options.depthAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(_gl.DEPTH_ATTACHMENT, options.depthAttachment);

        if(options.stencilAttachment instanceof WebGLTexture)
            this.attachTexture(_gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
        else if(options.stencilAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(_gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
    }

    bind(){
        if(this._handle !== Framebuffer._current){
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._handle);
            Framebuffer._current = this._handle;
        }
    }

    webGlFramebuffer(){
        return this._handle;
    }

    private attachTexture(attachmentType: number, texture: WebGLTexture){
        this.bind();
        this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, 
            attachmentType, 
            this._gl.TEXTURE_2D, 
            texture, 
            0);
        }
        
    private attachRenderbuffer(attachmentType: number, renderbuffer: WebGLRenderbuffer){
        this.bind();
        this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, 
            attachmentType, 
            this._gl.RENDERBUFFER, 
            renderbuffer);
    }

    checkStatus(): GlFramebufferStatus {
        throw "Not implemented"
    }

}