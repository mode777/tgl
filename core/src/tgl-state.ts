import { GlBlendEquation } from './constants/gl-blend-equation';
import { GlCullMode } from './constants/gl-cull-mode';
import { GlBlendMode } from './constants/gl-blend-mode';

export type Accessor<T> = (value?: T, cacheOnly?: boolean) => T;
export type GlEventHandler<T> = (value?: T) => void;
export type vec4<T> = [T,T,T,T];
export type vec2<T> = [T,T];


function arrayComparer(a: any[], b: any[]){
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        if(a[i] !== b[i])
            return false;
    }
    return true;
}

export class TglState {
    
    private stack: any[] = [];
    private accessors: {[key: string]: Accessor<any>} = {};
    private listeners: {[key:string]: GlEventHandler<any>[]} = {}
    private textures: WebGLTexture[] = new Array(this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));

    readonly activeTexture = this.createAccessor<number>(
        'activeTexture',
        this.gl.getParameter(this.gl.ACTIVE_TEXTURE) - this.gl.TEXTURE0,
        (value) => {
            if(value >= this.textures.length)
                throw `Cannot activate texture unit ${value} as MAX_COMBINED_TEXTURE_IMAGE_UNITS (${this.textures.length}) was exceeded`; 
            this.gl.activeTexture(value + this.gl.TEXTURE0)
        });
    
    readonly clearColor = this.createAccessor<vec4<number>>(
        'clearColor',
        this.gl.getParameter(this.gl.COLOR_CLEAR_VALUE),
        (value) => this.gl.clearColor(value[0], value[1], value[2], value[3]),
        arrayComparer);

    readonly blendColor = this.createAccessor<vec4<number>>(
        'blendColor',
        this.gl.getParameter(this.gl.BLEND_COLOR),
        (value) => this.gl.blendColor(value[0],value[1],value[2],value[3]),
        arrayComparer);

    readonly colorMask = this.createAccessor<vec4<boolean>>(
        'colorMask',
        this.gl.getParameter(this.gl.COLOR_WRITEMASK),
        (value) => this.gl.colorMask(value[0],value[1],value[2],value[3]),
        arrayComparer);

    readonly viewport = this.createAccessor<vec4<number>>(
        'viewport',
        this.gl.getParameter(this.gl.VIEWPORT),
        (value) => this.gl.viewport(value[0], value[1], value[2], value[3]));

    readonly blendFuncRgb = this.createAccessor<vec2<GlBlendMode>>(
        'blendFuncRgb',
        [this.gl.getParameter(this.gl.BLEND_SRC_RGB), this.gl.getParameter(this.gl.BLEND_DST_RGB)],
        (value) => this.gl.blendFuncSeparate(value[0], value[1], this.blendFuncAlpha()[0], this.blendFuncAlpha()[1]),
        arrayComparer);

    readonly blendFuncAlpha = this.createAccessor<vec2<GlBlendMode>>(
        'blendFuncAlpha',
        [this.gl.getParameter(this.gl.BLEND_SRC_ALPHA), this.gl.getParameter(this.gl.BLEND_DST_ALPHA)],
        (value) => this.gl.blendFuncSeparate(this.blendFuncRgb()[0], this.blendFuncRgb()[1],  value[0], value[1]),
        arrayComparer);

    // readonly blendEquation = createAccessor<GlBlendEquation>(
    //     this.gl.getParameter(this.gl.BLEND_EQUATION),
    //     (value) => this.gl.blendEquation(value));

    readonly blendEquationRgb = this.createAccessor<GlBlendEquation>(
        'blendEquationRgb',
        this.gl.getParameter(this.gl.BLEND_EQUATION_RGB),
        (value) => this.gl.blendEquationSeparate(value, this.blendEquationAlpha()));

    readonly blendEquationAlpha = this.createAccessor<GlBlendEquation>(
        'blendEquationAlpha',
        this.gl.getParameter(this.gl.BLEND_EQUATION_ALPHA),
        (value) => this.gl.blendEquationSeparate(this.blendEquationRgb(), value));

    readonly cullFaceMode = this.createAccessor<GlCullMode>(
        'cullFaceMode',
        this.gl.getParameter(this.gl.CULL_FACE_MODE),
        (value) =>this.gl.cullFace(value));

    readonly clearDepth = this.createAccessor<number>(
        'clearDepth',
        this.gl.getParameter(this.gl.DEPTH_CLEAR_VALUE),
        (value) => this.gl.clearDepth(value));

    readonly clearStencil = this.createAccessor<number>(
        'clearStencil',
        this.gl.getParameter(this.gl.STENCIL_CLEAR_VALUE),
        (value) => this.gl.clearStencil(value));

    readonly blendingEnabled = this.createAccessor<boolean>(
        'blendingEnabled',
        this.gl.isEnabled(this.gl.BLEND),
        (value) => value ? this.gl.enable(this.gl.BLEND) : this.gl.disable(this.gl.BLEND));

    readonly faceCullingEnabled = this.createAccessor<boolean>(
        'faceCullingEnabled',
        this.gl.isEnabled(this.gl.CULL_FACE),
        (value) => value ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE));

    readonly depthTestEnabled = this.createAccessor<boolean>(
        'depthTestEnabled',
        this.gl.isEnabled(this.gl.DEPTH_TEST),
        (value) => value ? this.gl.enable(this.gl.DEPTH_TEST) : this.gl.disable(this.gl.DEPTH_TEST));

    readonly polygonOffsetFillEnabled = this.createAccessor<boolean>(
        'polygonOffsetFillEnabled',
        this.gl.isEnabled(this.gl.POLYGON_OFFSET_FILL),
        (value) => value ? this.gl.enable(this.gl.POLYGON_OFFSET_FILL) : this.gl.disable(this.gl.POLYGON_OFFSET_FILL));

    readonly sampleAlphaToCoverageEnabled = this.createAccessor<boolean>(
        'sampleAlphaToCoverageEnabled',
        this.gl.isEnabled(this.gl.SAMPLE_ALPHA_TO_COVERAGE),
        (value) => value ? this.gl.enable(this.gl.SAMPLE_ALPHA_TO_COVERAGE) : this.gl.disable(this.gl.SAMPLE_ALPHA_TO_COVERAGE));
        
    readonly sampleCoverageEnabled = this.createAccessor<boolean>(
        'sampleCoverageEnabled',
        this.gl.isEnabled(this.gl.SAMPLE_COVERAGE),
        (value) => value ? this.gl.enable(this.gl.SAMPLE_COVERAGE) : this.gl.disable(this.gl.SAMPLE_COVERAGE));

    readonly scissorTestEnabled = this.createAccessor<boolean>(
        'scissorTestEnabled',
        this.gl.isEnabled(this.gl.SCISSOR_TEST),
        (value) => value ? this.gl.enable(this.gl.SCISSOR_TEST) : this.gl.disable(this.gl.SCISSOR_TEST));

    readonly stencilTestEnabled = this.createAccessor<boolean>(
        'stencilTestEnabled',
        this.gl.isEnabled(this.gl.STENCIL_TEST),
        (value) => value ? this.gl.enable(this.gl.STENCIL_TEST) : this.gl.disable(this.gl.STENCIL_TEST));

    readonly texture: Accessor<WebGLTexture> = (value?: WebGLTexture, cacheOnly = false) => {
        if(value !== undefined && value !== this.textures[this.activeTexture()]){
            this.textures[this.activeTexture()] = value;
            if(!cacheOnly)
                this.gl.bindTexture(this.gl.TEXTURE_2D, value);
            this.dispatch('texture', { texture: value, unit: this.activeTexture() });
        }
        return this.textures[this.activeTexture()];
    }

    readonly framebuffer = this.createAccessor<WebGLFramebuffer>(
        'framebuffer',
        null,
        (value) => this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, value));

    readonly vertexBuffer = this.createAccessor<WebGLBuffer>(
        'vertexBuffer',
        null,
        (value) => this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value));

    readonly indexBuffer = this.createAccessor<WebGLBuffer>(
        'indexBuffer',
        null,
        (value) => this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, value));

    readonly program = this.createAccessor<WebGLProgram>(
        'program',
        null,
        (value) => this.gl.useProgram(value));

    readonly renderbuffer = this.createAccessor<WebGLRenderbuffer>(
        'renderbuffer',
        null,
        (value) => this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, value));

    public constructor(private gl: WebGLRenderingContext){
        this.accessors['texture'] = this.texture;
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
        return Object.keys(this.accessors)
            .reduce<TglStateSnapshot>((p,c) => {
                p[c] = this.accessors[c]();
                return p; 
            }, <TglStateSnapshot>{});        
    }

    public on(property: string, handler: GlEventHandler<any>){
        if(!this.listeners[property])
            this.listeners[property] = [];

        this.listeners[property].push(handler);
    }

    public off(property: string, handler: GlEventHandler<any>){
        if(this.listeners[property]){
            var index = this.listeners[property].indexOf(handler);
            if(index !== -1){
                this.listeners[property].splice(index, 1);
            }
        }
    }

    private dispatch(property: string, value: any){
        if(this.listeners[property])
            this.listeners[property].forEach(x => x(value));
    }

    private createAccessor<T>(name: string, initial: T, setter: (value: T) => void, comparer?: (a: T, b: T) => boolean): Accessor<T>{
        let state = initial;
        
        var acc = (value?: T, cacheOnly = false) => {
            if(value !== undefined && (comparer !== undefined ? !comparer(state, value) : state !== value)){
                if(!cacheOnly) 
                    setter(value);
                state = value;
                this.dispatch(name, value);
            }
            return state;
        }

        this.accessors[name] = acc;
        return acc;
    }

}

export interface TglStateSnapshot {
    texture: WebGLTexture,
    activeTexture: number,
    blendColor: vec4<number>,
    //blendEquation: GlBlendEquation,
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
    blendFuncRgb: vec2<GlBlendMode>,
    blendFuncAlpha: vec2<GlBlendMode>
}