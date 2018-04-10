import { GlClearFlags } from './constants/gl-clear-flags';
import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlError } from './constants/gl-error';

const defaultOptions: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
    premultipliedAlpha: false,
    stencil: false,
    preserveDrawingBuffer: false
}

export class TglContext {
        
    private _gl: WebGLRenderingContext;
    private _canvas: HTMLCanvasElement;
    private _elementArrayBuffer: WebGLBuffer;

    constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes){
        this._canvas = canvas;

        const context = this._canvas.getContext('webgl', Object.assign({}, defaultOptions, options));         
        
        if(context !== null)
            this._gl = context; 
        else
            throw 'Unable to initialize WebGLRenderingContext';
    }

    get webGlRenderingContext(){
        return this._gl;
    }

    get canvas(){
        return this._canvas;
    }    

    clear(flags = GlClearFlags.COLOR_BUFFER_BIT){
        this._gl.clear(flags);
    }

    get clearColor() { return this._gl.getParameter(this._gl.COLOR_CLEAR_VALUE); }
    set clearColor(value: [number, number, number, number]) { this._gl.clearColor(value[0],value[1],value[2],value[3]);  }

    get activeTexture(){ return this._gl.getParameter(this._gl.ACTIVE_TEXTURE); }
    set activeTexture(value: number){ this._gl.activeTexture(value); }

    get blendColor() { return this._gl.getParameter(this._gl.BLEND_COLOR); }
    set blendColor(value: [number, number, number, number]) { this._gl.blendColor(value[0],value[1],value[2],value[3]);  }

    get colorMask() { return this._gl.getParameter(this._gl.COLOR_WRITEMASK); }
    set colorMask(value: [boolean, boolean, boolean, boolean]) { this._gl.colorMask(value[0],value[1],value[2],value[3]);  }

    get blendEquation() { return this._gl.getParameter(this._gl.BLEND_EQUATION); }
    set blendEquation(value: GlBlendEquation) { this._gl.blendEquation(value); }

    get blendEquationRgb() { return this._gl.getParameter(this._gl.BLEND_EQUATION_RGB); }
    set blendEquationRgb(value: GlBlendEquation) { this._gl.blendEquationSeparate(value, this.blendEquationAlpha);  }
    
    get blendEquationAlpha() { return this._gl.getParameter(this._gl.BLEND_EQUATION_ALPHA); }
    set blendEquationAlpha(value: GlBlendEquation) { this._gl.blendEquationSeparate(this.blendEquationRgb, value);  }

    get clearDepth() { return this._gl.getParameter(this._gl.DEPTH_CLEAR_VALUE); }
    set clearDepth(value: number) { this._gl.clearDepth(value); }
    
    get clearStencil() { return this._gl.getParameter(this._gl.STENCIL_CLEAR_VALUE); }
    set clearStencil(value: number) { this._gl.clearStencil(value); }

    get cullFaceMode() { return this._gl.getParameter(this._gl.CULL_FACE_MODE); }
    set cullFaceMode(value: GlCullMode) { this._gl.cullFace(value); } 

    // TODO: Blend func

    get blendingEnabled() { return this._gl.isEnabled(this._gl.BLEND);  }
    set blendingEnabled(value: boolean) { value ? this._gl.enable(this._gl.BLEND) : this._gl.disable(this._gl.BLEND);  }
    
    get faceCullingEnabled() { return this._gl.isEnabled(this._gl.CULL_FACE);  }
    set faceCullingEnabled(value: boolean) { value ? this._gl.enable(this._gl.CULL_FACE) : this._gl.disable(this._gl.CULL_FACE);  }
    
    get depthTestEnabled() { return this._gl.isEnabled(this._gl.DEPTH_TEST);  }
    set depthTestEnabled(value: boolean) { value ? this._gl.enable(this._gl.DEPTH_TEST) : this._gl.disable(this._gl.DEPTH_TEST);  }
    
    get ditherEnabled() { return this._gl.isEnabled(this._gl.DITHER);  }
    set ditherEnabled(value: boolean) { value ? this._gl.enable(this._gl.DITHER) : this._gl.disable(this._gl.DITHER);  }
    
    get polygonOffsetFillEnabled() { return this._gl.isEnabled(this._gl.POLYGON_OFFSET_FILL);  }
    set polygonOffsetFillEnabled(value: boolean) { value ? this._gl.enable(this._gl.POLYGON_OFFSET_FILL) : this._gl.disable(this._gl.POLYGON_OFFSET_FILL);  }
    
    get sampleAlphaToCoverageEnabled() { return this._gl.isEnabled(this._gl.SAMPLE_ALPHA_TO_COVERAGE);  }
    set sampleAlphaToCoverageEnabled(value: boolean) { value ? this._gl.enable(this._gl.SAMPLE_ALPHA_TO_COVERAGE) : this._gl.disable(this._gl.SAMPLE_ALPHA_TO_COVERAGE);  }
    
    get sampleCoverageEnabled() { return this._gl.isEnabled(this._gl.SAMPLE_COVERAGE);  }
    set sampleCoverageEnabled(value: boolean) { value ? this._gl.enable(this._gl.SAMPLE_COVERAGE) : this._gl.disable(this._gl.SAMPLE_COVERAGE);  }
    
    get scissorTestEnabled() { return this._gl.isEnabled(this._gl.SCISSOR_TEST);  }
    set scissorTestEnabled(value: boolean) { value ? this._gl.enable(this._gl.SCISSOR_TEST) : this._gl.disable(this._gl.SCISSOR_TEST);  }
    
    get stencilTestEnabled() { return this._gl.isEnabled(this._gl.STENCIL_TEST);  }
    set stencilTestEnabled(value: boolean) { value ? this._gl.enable(this._gl.STENCIL_TEST) : this._gl.disable(this._gl.STENCIL_TEST);  }  

    checkErrors(){
        const error = <GlError>this._gl.getError();
        if(error !== GlError.NO_ERROR){
            throw GlError[error];
        }
    }
}