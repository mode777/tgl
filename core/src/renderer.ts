import { GlClearFlags, GlError, GlTexture, GlParam, GlBlendEquation, GlFeature, GlBufferType, GlCullMode } from "./constants";

export class Renderer {
        
    private _handle: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;
    private _elementArrayBuffer: WebGLBuffer;

    constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes){
        this._canvas = canvas;

        const context = this._canvas.getContext('webgl', options);         
        
        if(context !== null)
            this._handle = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';
    }

    get handle(){
        return this._handle;
    }

    get canvas(){
        return this._canvas;
    }    

    clear(flags = GlClearFlags.COLOR_BUFFER_BIT){
        this._handle.clear(flags);
    }

    get clearColor() { return this._handle.getParameter(GlParam.COLOR_CLEAR_VALUE); }
    set clearColor(value: [number, number, number, number]) { this._handle.clearColor(value[0],value[1],value[2],value[3]);  }

    get activeTexture(){ return this._handle.getParameter(GlParam.ACTIVE_TEXTURE); }
    set activeTexture(value: number){ this._handle.activeTexture(value); }

    get blendColor() { return this._handle.getParameter(GlParam.BLEND_COLOR); }
    set blendColor(value: [number, number, number, number]) { this._handle.blendColor(value[0],value[1],value[2],value[3]);  }

    get colorMask() { return this._handle.getParameter(GlParam.COLOR_WRITEMASK); }
    set colorMask(value: [boolean, boolean, boolean, boolean]) { this._handle.colorMask(value[0],value[1],value[2],value[3]);  }

    get blendEquation() { return this._handle.getParameter(GlParam.BLEND_EQUATION); }
    set blendEquation(value: GlBlendEquation) { this._handle.blendEquation(value); }

    get blendEquationRgb() { return this._handle.getParameter(GlParam.BLEND_EQUATION_RGB); }
    set blendEquationRgb(value: GlBlendEquation) { this._handle.blendEquationSeparate(value, this.blendEquationAlpha);  }
    
    get blendEquationAlpha() { return this._handle.getParameter(GlParam.BLEND_EQUATION_ALPHA); }
    set blendEquationAlpha(value: GlBlendEquation) { this._handle.blendEquationSeparate(this.blendEquationRgb, value);  }

    get clearDepth() { return this._handle.getParameter(GlParam.DEPTH_CLEAR_VALUE); }
    set clearDepth(value: number) { this._handle.clearDepth(value); }
    
    get clearStencil() { return this._handle.getParameter(GlParam.STENCIL_CLEAR_VALUE); }
    set clearStencil(value: number) { this._handle.clearStencil(value); }

    get cullFaceMode() { return this._handle.getParameter(GlParam.CULL_FACE_MODE); }
    set cullFaceMode(value: GlCullMode) { this._handle.cullFace(value); } 

    // TODO: Blend func

    get blendingEnabled() { return this._handle.isEnabled(GlFeature.BLEND);  }
    set blendingEnabled(value: boolean) { value ? this._handle.enable(GlFeature.BLEND) : this._handle.disable(GlFeature.BLEND);  }
    
    get faceCullingEnabled() { return this._handle.isEnabled(GlFeature.CULL_FACE);  }
    set faceCullingEnabled(value: boolean) { value ? this._handle.enable(GlFeature.CULL_FACE) : this._handle.disable(GlFeature.CULL_FACE);  }
    
    get depthTestEnabled() { return this._handle.isEnabled(GlFeature.DEPTH_TEST);  }
    set depthTestEnabled(value: boolean) { value ? this._handle.enable(GlFeature.DEPTH_TEST) : this._handle.disable(GlFeature.DEPTH_TEST);  }
    
    get ditherEnabled() { return this._handle.isEnabled(GlFeature.DITHER);  }
    set ditherEnabled(value: boolean) { value ? this._handle.enable(GlFeature.DITHER) : this._handle.disable(GlFeature.DITHER);  }
    
    get polygonOffsetFillEnabled() { return this._handle.isEnabled(GlFeature.POLYGON_OFFSET_FILL);  }
    set polygonOffsetFillEnabled(value: boolean) { value ? this._handle.enable(GlFeature.POLYGON_OFFSET_FILL) : this._handle.disable(GlFeature.POLYGON_OFFSET_FILL);  }
    
    get sampleAlphaToCoverageEnabled() { return this._handle.isEnabled(GlFeature.SAMPLE_ALPHA_TO_COVERAGE);  }
    set sampleAlphaToCoverageEnabled(value: boolean) { value ? this._handle.enable(GlFeature.SAMPLE_ALPHA_TO_COVERAGE) : this._handle.disable(GlFeature.SAMPLE_ALPHA_TO_COVERAGE);  }
    
    get sampleCoverageEnabled() { return this._handle.isEnabled(GlFeature.SAMPLE_COVERAGE);  }
    set sampleCoverageEnabled(value: boolean) { value ? this._handle.enable(GlFeature.SAMPLE_COVERAGE) : this._handle.disable(GlFeature.SAMPLE_COVERAGE);  }
    
    get scissorTestEnabled() { return this._handle.isEnabled(GlFeature.SCISSOR_TEST);  }
    set scissorTestEnabled(value: boolean) { value ? this._handle.enable(GlFeature.SCISSOR_TEST) : this._handle.disable(GlFeature.SCISSOR_TEST);  }
    
    get stencilTestEnabled() { return this._handle.isEnabled(GlFeature.STENCIL_TEST);  }
    set stencilTestEnabled(value: boolean) { value ? this._handle.enable(GlFeature.STENCIL_TEST) : this._handle.disable(GlFeature.STENCIL_TEST);  }  

    draw(){

        
    }

    checkErrors(){
        const error = <GlError>this._handle.getError();
        if(error !== GlError.NO_ERROR){
            throw GlError[error];
        }
    }
}