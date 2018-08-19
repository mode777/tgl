import { GlFramebufferStatus } from './constants/gl-framebuffer-status';
import { TglContext } from './tgl-context';
import { Texture } from './texture';
import { Renderbuffer } from './renderbuffer';

export interface FramebufferOptions {
    width?: number,
    height?: number,
    colorAttachment?: Texture | WebGLRenderbuffer,
    depthAttachment?: Texture | WebGLRenderbuffer,
    stencilAttachment?: Texture | WebGLRenderbuffer
}

export class Framebuffer {
    private state = this.context.state;
    private gl = this.context.webGlRenderingContext;
    private handle: WebGLFramebuffer;
    
    public readonly width: number;
    public readonly height: number;
    public readonly colorAttachment: Texture | Renderbuffer;
    public readonly depthAttachment: Texture | Renderbuffer;
    public readonly stencilAttachment: Texture | Renderbuffer;
    
    constructor(protected context: TglContext, options: FramebufferOptions){
        this.handle = this.gl.createFramebuffer();
        
        this.bind();
        
        if(options.colorAttachment){
            if(options.colorAttachment instanceof Texture)
                this.attachTexture(this.gl.COLOR_ATTACHMENT0, options.colorAttachment);
            else if(options.colorAttachment instanceof Renderbuffer)
                this.attachRenderbuffer(this.gl.COLOR_ATTACHMENT0, options.colorAttachment)
            else
                throw 'colorAttachment is not a WebGlTexture nor WebGlRenderbuffer';

            this.colorAttachment = options.colorAttachment;
        }

        if(options.depthAttachment){
            if(options.depthAttachment instanceof Texture)
                this.attachTexture(this.gl.DEPTH_ATTACHMENT, options.depthAttachment);
            else if(options.depthAttachment instanceof Renderbuffer)
                this.attachRenderbuffer(this.gl.DEPTH_ATTACHMENT, options.depthAttachment);
            else
                throw 'depthAttachment is not a WebGlTexture nor WebGlRenderbuffer';
            
            this.depthAttachment = options.depthAttachment
        }

        if(options.stencilAttachment){
            if(options.stencilAttachment instanceof Texture)
                this.attachTexture(this.gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
            else if(options.stencilAttachment instanceof Renderbuffer)
                this.attachRenderbuffer(this.gl.STENCIL_ATTACHMENT, options.stencilAttachment);            
            else
                throw 'stencilAttachment is not a WebGlTexture nor WebGlRenderbuffer';

            this.stencilAttachment = options.stencilAttachment;
        }

        switch(this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER))
        {
            case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw 'FRAMEBUFFER_INCOMPLETE_ATTACHMENT: The framebuffer attachment types are mismatched or not all framebuffer attachment points are framebuffer attachment complete.';
            case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw 'FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: There is no attachment.';
            case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw 'FRAMEBUFFER_INCOMPLETE_DIMENSIONS: Height and width of the attachments are not the same.'
            case this.gl.FRAMEBUFFER_UNSUPPORTED:
                throw 'FRAMEBUFFER_UNSUPPORTED: The format of the attachment is not supported or if depth and stencil attachments are not the same renderbuffer.';
        }

        if(!options.width || !options.height){
            const anyAttachment = this.colorAttachment || this.depthAttachment || this.stencilAttachment;
            this.width = anyAttachment.width;
            this.height = anyAttachment.height;
        }
        else {
            this.width = options.width;
            this.height = options.height;
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

    private attachTexture(attachmentType: number, texture: Texture){
        this.bind();
        this.state.texture(texture.webGlTexture);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.TEXTURE_2D, 
            texture.webGlTexture, 
            0);
    }
        
    private attachRenderbuffer(attachmentType: number, renderbuffer: Renderbuffer){
        this.bind();
        this.state.renderbuffer(renderbuffer.webGlRenderbuffer);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, 
            attachmentType, 
            this.gl.RENDERBUFFER, 
            renderbuffer.webGlRenderbuffer);
    }

    checkStatus(): GlFramebufferStatus {
        throw "Not implemented"
    }
}