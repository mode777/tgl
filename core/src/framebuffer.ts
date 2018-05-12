import { GlFramebufferStatus } from './constants/gl-framebuffer-status';
import { TglState } from './tgl-state';

export interface FramebufferOptions {
    width: number,
    height: number,
    colorAttachment?: WebGLTexture | WebGLRenderbuffer,
    depthAttachment?: WebGLTexture | WebGLRenderbuffer,
    stencilAttachment?: WebGLTexture | WebGLRenderbuffer
}

export class Framebuffer {
    private state = TglState.getCurrent(this.gl);
    private handle: WebGLFramebuffer;
    
    public readonly width: number;
    public readonly height: number;
    public readonly colorAttachment: WebGLTexture | WebGLRenderbuffer;
    public readonly depthAttachment: WebGLTexture | WebGLRenderbuffer;
    public readonly stencilAttachment: WebGLTexture | WebGLRenderbuffer;
    
    constructor(protected gl: WebGLRenderingContext, options: FramebufferOptions){
        this.handle = gl.createFramebuffer();
        
        this.width = options.width;
        this.height = options.height;
        
        this.bind();
        
        if(options.colorAttachment){
            if(options.colorAttachment instanceof WebGLTexture)
                this.attachTexture(gl.COLOR_ATTACHMENT0, options.colorAttachment);
            else if(options.colorAttachment instanceof WebGLRenderbuffer)
                this.attachRenderbuffer(gl.COLOR_ATTACHMENT0, options.colorAttachment)
            else
                throw 'colorAttachment is not a WebGlTexture nor WebGlRenderbuffer';

            this.colorAttachment = options.colorAttachment;
        }

        if(options.depthAttachment){
            if(options.depthAttachment instanceof WebGLTexture)
                this.attachTexture(gl.DEPTH_ATTACHMENT, options.depthAttachment);
            else if(options.depthAttachment instanceof WebGLRenderbuffer)
                this.attachRenderbuffer(gl.DEPTH_ATTACHMENT, options.depthAttachment);
            else
                throw 'depthAttachment is not a WebGlTexture nor WebGlRenderbuffer';
            
            this.depthAttachment = options.depthAttachment
        }

        if(options.stencilAttachment){
            if(options.stencilAttachment instanceof WebGLTexture)
                this.attachTexture(gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
            else if(options.stencilAttachment instanceof WebGLRenderbuffer)
                this.attachRenderbuffer(gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
            else
                throw 'stencilAttachment is not a WebGlTexture nor WebGlRenderbuffer';

            this.stencilAttachment = options.stencilAttachment;
        }

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

        this.state.framebuffer(null);
    }

    bind(){
        this.state.framebuffer(this.handle);
    }

    webGlFramebuffer(){
        return this.handle;
    }

    public render(func: () => void){
        const viewport = this.state.viewport();
        
        this.bind();
        this.state.viewport([0,0,this.width, this.height]);
        
        func();
        
        this.state.framebuffer(null);
        this.state.viewport(viewport);
    }

    private attachTexture(attachmentType: number, texture: WebGLTexture){
        this.bind();
        this.state.texture(texture);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.TEXTURE_2D, 
            texture, 
            0);
    }
        
    private attachRenderbuffer(attachmentType: number, renderbuffer: WebGLRenderbuffer){
        this.bind();
        this.state.renderbuffer(renderbuffer);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.RENDERBUFFER, 
            renderbuffer);
    }

    checkStatus(): GlFramebufferStatus {
        throw "Not implemented"
    }

}