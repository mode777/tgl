import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlBlendMode } from './constants/gl-blend-mode';

export type Accessor<T> = (value?: T, cacheOnly?: boolean) => T;
export type vec4<T> = [T,T,T,T];
export type vec2<T> = [T,T];

function createAccessor<T>(initial: T, setter: (value: T) => void, comparer?: (a: T, b: T) => boolean): Accessor<T>{
    let closure = initial;

    return function(value?: T, cacheOnly = false) {
        if(value !== undefined && (comparer !== undefined ? !comparer(closure, value) : closure !== value)){
            if(!cacheOnly) 
                setter(value);
            closure = value;
        }
        return closure;
    }
}

function arrayComparer(a: any[], b: any[]){
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        if(a[i] !== b[i])
            return false;
    }
    return true;
}

export class TglState {

    private static refCtr = 0;
    private static _current: TglState[] = [];
    public static getCurrent(gl: WebGLRenderingContext){
        if(gl['ref'] === undefined){
            gl['ref'] = this.refCtr++;
            TglState._current[gl['ref']] = new TglState(gl);
        }
        return TglState._current[gl['ref']];
    }
    
    private stack: any[] = [];
    private textures: WebGLTexture[] = new Array(this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));

    readonly activeTexture = createAccessor<number>(
        this.gl.getParameter(this.gl.ACTIVE_TEXTURE) - this.gl.TEXTURE0,
        (value) => {
            if(value >= this.textures.length)
                throw `Cannot activate texture unit ${value} as MAX_COMBINED_TEXTURE_IMAGE_UNITS (${this.textures.length}) was exceeded`; 
            this.gl.activeTexture(value + this.gl.TEXTURE0)
        });
    
    readonly clearColor = createAccessor<vec4<number>>(
        this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE),
        (value) => this.gl.clearColor(value[0], value[1], value[2], value[3]),
        arrayComparer);

    readonly blendColor = createAccessor<vec4<number>>(
        this.gl.getParameter(this.gl.BLEND_COLOR),
        (value) => this.gl.blendColor(value[0],value[1],value[2],value[3]),
        arrayComparer);

    readonly colorMask = createAccessor<vec4<boolean>>(
        this.gl.getParameter(this.gl.COLOR_WRITEMASK),
        (value) => this.gl.colorMask(value[0],value[1],value[2],value[3]),
        arrayComparer);

    readonly viewport = createAccessor<vec4<number>>(
        this.gl.getParameter(this.gl.VIEWPORT),
        (value) => this.gl.viewport(value[0], value[1], value[2], value[3]));

    readonly blendFunc = createAccessor<vec2<GlBlendMode>>(
        [this.gl.getParameter(this.gl.BLEND_SRC_RGB), this.gl.getParameter(this.gl.BLEND_DST_RGB)],
        (value) => this.gl.blendFunc(value[0], value[1]),
        arrayComparer);

    readonly blendEquation = createAccessor<GlBlendEquation>(
        this.gl.getParameter(this.gl.BLEND_EQUATION),
        (value) => this.gl.blendEquation(value));

    readonly blendEquationRgb = createAccessor<GlBlendEquation>(
        this.gl.getParameter(this.gl.BLEND_EQUATION_RGB),
        (value) => this.gl.blendEquationSeparate(value, this.blendEquationAlpha()));

    readonly blendEquationAlpha = createAccessor<GlBlendEquation>(
        this.gl.getParameter(this.gl.BLEND_EQUATION_ALPHA),
        (value) => this.gl.blendEquationSeparate(this.blendEquationRgb(), value));

    readonly cullFaceMode = createAccessor<GlCullMode>(
        this.gl.getParameter(this.gl.CULL_FACE_MODE),
        (value) =>this.gl.cullFace(value));

    readonly clearDepth = createAccessor<number>(
        this.gl.getParameter(this.gl.DEPTH_CLEAR_VALUE),
        (value) => this.gl.clearDepth(value));

    readonly clearStencil = createAccessor<number>(
        this.gl.getParameter(this.gl.STENCIL_CLEAR_VALUE),
        (value) => this.gl.clearStencil(value));

    readonly blendingEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.BLEND),
        (value) => value ? this.gl.enable(this.gl.BLEND) : this.gl.disable(this.gl.BLEND));

    readonly faceCullingEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.CULL_FACE),
        (value) => value ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE));

    readonly depthTestEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.DEPTH_TEST),
        (value) => value ? this.gl.enable(this.gl.DEPTH_TEST) : this.gl.disable(this.gl.DEPTH_TEST));

    readonly polygonOffsetFillEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.POLYGON_OFFSET_FILL),
        (value) => value ? this.gl.enable(this.gl.POLYGON_OFFSET_FILL) : this.gl.disable(this.gl.POLYGON_OFFSET_FILL));

    readonly sampleAlphaToCoverageEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.SAMPLE_ALPHA_TO_COVERAGE),
        (value) => value ? this.gl.enable(this.gl.SAMPLE_ALPHA_TO_COVERAGE) : this.gl.disable(this.gl.SAMPLE_ALPHA_TO_COVERAGE));
        
    readonly sampleCoverageEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.SAMPLE_COVERAGE),
        (value) => value ? this.gl.enable(this.gl.SAMPLE_COVERAGE) : this.gl.disable(this.gl.SAMPLE_COVERAGE));

    readonly scissorTestEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.SCISSOR_TEST),
        (value) => value ? this.gl.enable(this.gl.SCISSOR_TEST) : this.gl.disable(this.gl.SCISSOR_TEST));

    readonly stencilTestEnabled = createAccessor<boolean>(
        this.gl.isEnabled(this.gl.STENCIL_TEST),
        (value) => value ? this.gl.enable(this.gl.STENCIL_TEST) : this.gl.disable(this.gl.STENCIL_TEST));

    readonly texture: Accessor<WebGLTexture> = (value?: WebGLTexture, cacheOnly = false) => {
        if(value !== undefined && value !== this.textures[this.activeTexture()]){
            this.textures[this.activeTexture()] = value;
            if(!cacheOnly)
                this.gl.bindTexture(this.gl.TEXTURE_2D, value);
        }
        return this.textures[this.activeTexture()];
    }

    readonly framebuffer = createAccessor<WebGLFramebuffer>(
        null,
        (value) => this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, value));

    readonly vertexBuffer = createAccessor<WebGLBuffer>(
        null,
        (value) => this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value));

    readonly indexBuffer = createAccessor<WebGLBuffer>(
        null,
        (value) => this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, value));

    readonly program = createAccessor<WebGLProgram>(
        null,
        (value) => this.gl.useProgram(value));

    readonly renderbuffer = createAccessor<WebGLRenderbuffer>(
        null,
        (value) => this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, value));

    private constructor(private gl: WebGLRenderingContext){
        this.push();
    }

    public push(){
        this.stack.push(this.get());
    }

    public pop(){
        if(this.stack.length > 1){
            this.set(this.stack.pop());
        }
        else {
            this.set(this.stack[0]);
        }
    }

    public reset() {
        this.set(this.stack[0])
    }

    public set(state: Partial<TglStateSnapshot>) {
        Object.keys(state).forEach(name => this[name](state[name]));
    }

    public get(): TglStateSnapshot {
        return {
            texture: this.texture(),
            activeTexture: this.activeTexture(),
            blendColor: this.blendColor(),
            blendEquation: this.blendEquation(),
            blendEquationAlpha: this.blendEquationAlpha(),
            blendEquationRgb: this.blendEquationRgb(),
            blendingEnabled: this.blendingEnabled(),
            clearColor: this.clearColor(),
            clearDepth: this.clearDepth(),
            clearStencil: this.clearStencil(),
            colorMask: this.colorMask(),
            cullFaceMode: this.cullFaceMode(),
            depthTestEnabled: this.depthTestEnabled(),
            faceCullingEnabled: this.faceCullingEnabled(),
            framebuffer: this.framebuffer(),
            indexBuffer: this.indexBuffer(),
            polygonOffsetFillEnabled: this.polygonOffsetFillEnabled(),
            program: this.program(),
            sampleAlphaToCoverageEnabled: this.sampleAlphaToCoverageEnabled(),
            sampleCoverageEnabled: this.sampleCoverageEnabled(),
            scissorTestEnabled: this.scissorTestEnabled(),
            stencilTestEnabled: this.stencilTestEnabled(),
            vertexBuffer: this.vertexBuffer(),
            viewport: this.viewport(),
            blendFunc: this.blendFunc()
            //maxCombinedTextureImageUnits: this.textures.length
        }
    }
}

export interface TglStateSnapshot {
    texture: WebGLTexture,
    activeTexture: number,
    blendColor: vec4<number>,
    blendEquation: GlBlendEquation,
    blendEquationAlpha: GlBlendEquation,
    blendEquationRgb: GlBlendEquation,
    blendingEnabled: boolean,
    clearColor: vec4<number>,
    clearDepth: number,
    clearStencil: number,
    colorMask: vec4<boolean>,
    cullFaceMode: GlCullMode,
    depthTestEnabled: boolean,
    faceCullingEnabled: boolean,
    framebuffer: WebGLFramebuffer,
    indexBuffer: WebGLBuffer,
    polygonOffsetFillEnabled: boolean,
    program: WebGLProgram,
    sampleAlphaToCoverageEnabled: boolean,
    sampleCoverageEnabled: boolean,
    scissorTestEnabled: boolean,
    stencilTestEnabled: boolean,
    vertexBuffer: WebGLBuffer,
    viewport: vec4<number>,
    blendFunc: vec2<GlBlendMode>
}