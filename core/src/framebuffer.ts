import { GlFramebufferStatus } from './constants/gl-framebuffer-status';
import { TglState } from './tgl-state';

export interface FramebufferOptions {
    colorAttachment?: WebGLTexture | WebGLRenderbuffer,
    depthAttachment?: WebGLTexture | WebGLRenderbuffer,
    stencilAttachment?: WebGLTexture | WebGLRenderbuffer
}

export class Framebuffer {
    
    private state = TglState.getCurrent(this.gl);
    private handle: WebGLFramebuffer;
    
    constructor(protected gl: WebGLRenderingContext, options: FramebufferOptions = {}){
        this.handle = gl.createFramebuffer();
        this.bind();
        
        if(options.colorAttachment instanceof WebGLTexture)
            this.attachTexture(gl.COLOR_ATTACHMENT0, options.colorAttachment);
        else if(options.colorAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(gl.COLOR_ATTACHMENT0, options.colorAttachment)
        else if(options.colorAttachment)
            throw 'colorAttachment is not a WebGlTexture nor WebGlRenderbuffer';

        if(options.depthAttachment instanceof WebGLTexture)
            this.attachTexture(gl.DEPTH_ATTACHMENT, options.depthAttachment);
        else if(options.depthAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(gl.DEPTH_ATTACHMENT, options.depthAttachment);
        else if(options.depthAttachment)
            throw 'depthAttachment is not a WebGlTexture nor WebGlRenderbuffer';

        if(options.stencilAttachment instanceof WebGLTexture)
            this.attachTexture(gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
        else if(options.stencilAttachment instanceof WebGLRenderbuffer)
            this.attachRenderbuffer(gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
        else if(options.stencilAttachment)
            throw 'stencilAttachment is not a WebGlTexture nor WebGlRenderbuffer';

        switch(gl.checkFramebufferStatus(gl.FRAMEBUFFER))
        {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The framebuffer attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete.';
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.';
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachments are not the same.'
            case gl.FRAMEBUFFER_UNSUPPORTED:
                throw 'FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer.';
        }
    }

    bind(){
        this.state.framebuffer(this.handle);
    }

    webGlFramebuffer(){
        return this.handle;
    }

    private attachTexture(attachmentType: number, texture: WebGLTexture){
        this.bind();
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.TEXTURE_2D, 
            texture, 
            0);
    }
        
    private attachRenderbuffer(attachmentType: number, renderbuffer: WebGLRenderbuffer){
        this.bind();
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.RENDERBUFFER, 
            renderbuffer);
    }

    checkStatus(): GlFramebufferStatus {
        throw "Not implemented"
    }

}