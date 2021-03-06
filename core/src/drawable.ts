import { BufferOptions, VertexBuffer } from './vertex-buffer';
import { Texture, TextureOptions } from './texture';
import { Shader, ShaderOptions, UniformValue } from './shader';
import { IndexBuffer } from './index-buffer';
import { GlPrimitiveType } from './constants/gl-primitive-type';
import { FramebufferOptions, Framebuffer } from './framebuffer';
import { TglState } from './tgl-state';

/** Options to initialize a drawable with */
export interface DrawableOptions {
    /** An array of either {@link VertexBuffer} or {@link BufferOptions}. 
     * If options are supplied, new instances are created */
    buffers: (VertexBuffer | BufferOptions)[],
    /** Either a {@link Shader} or {@link ShaderOptions}
     * If options are supplied, a new instance is created */
    shader: Shader | ShaderOptions
    /** An array of of vertex indices, which can be supplied a number array, UInt16Array or {@link IndexBuffer}.
     * If no indices are supplied, each three vertices are interpreted as a new triangle. */
    indices?: IndexBuffer | number[] | Uint16Array;
    /** An object which contains either a {@link Texture} or a {@link TextureOptions}.
     * If options are supplied, new instances are created.
     * The keys of the object should correspond with the sampler2D uniforms in the shader. */
    textures?: {[key:string]: Texture | TextureOptions }
    /** An object containing uniform values to be sent to the shader.
     * The keys of the object should correspond with the uniforms in the shader.
     * For sampler2D uniforms you should use the 'textures' option. */
    uniforms?: {[key:string]: UniformValue }
}

/** Represents a set of WebGL primitives, which can be utilized to draw an image. */
export class Drawable {
    private state = TglState.getCurrent(this.gl);
    private indices: IndexBuffer = null;
    
    public readonly textures: {[key:string]: Texture } = {};
    public readonly uniforms: {[key:string]: UniformValue} = {};
    public readonly buffers: VertexBuffer[] = [];
    public readonly shader: Shader;

    /** Creates a new drawable instance
     * @param gl A WebGL rendering context
     * @param options Options object to initialize drawable with. */
    constructor(protected gl: WebGLRenderingContext, private options: DrawableOptions){
        if(options.buffers.length === 0)
            throw 'You need at least one buffer to draw.';

        this.buffers = options.buffers.map(x => x instanceof VertexBuffer 
            ? x 
            : new VertexBuffer(gl, x));
        this.shader = options.shader instanceof Shader 
            ? options.shader 
            : new Shader(gl, options.shader);
        this.indices = options.indices !== undefined 
            ? (options.indices instanceof IndexBuffer 
                ? options.indices
                : new IndexBuffer(gl, options.indices)) 
            : null;

        Object.keys(options.textures || {}).forEach(name => {
            const tex = options.textures[name];
            this.textures[name] = options.textures[name] instanceof Texture 
                ? <Texture>options.textures[name]
                : new Texture(gl, <TextureOptions>options.textures[name])
        });
        this.uniforms = this.options.uniforms ? {...options.uniforms} : {};
    }
    
    /** Draw to the current framebuffer.
     * Automatically sets up attributes, uniforms, buffer etc..
     * @param mode Type of rendering primitives to draw. Default = TRIANGLES
     * @param start First vertex to draw. Default = 0
     * @param end Last vertex to draw. Default = -1 (all) */
    draw(mode: GlPrimitiveType = GlPrimitiveType.TRIANGLES, start: number = 0, end: number = -1){
        this.shader.use();

        this.buffers.forEach(x => 
            x.attributes.forEach(y => 
                x.enableAttribute(y.name, this.shader.getAttributeLocation(y.name))));
        
        let i = 0;
        for (const name in this.textures) {
            if  (this.textures.hasOwnProperty(name)) {
                const unit = this.textures[name].bind(i);
                this.shader.setUniform(name, unit);
                i++;
            }
        }

        // set uniforms and clear after set
        this.shader.setUniforms(this.uniforms);
        for (var key in this.uniforms) {
            delete this.uniforms[key];
        }
    
        if(this.indices !== null){
            this.indices.bind();
            this.gl.drawElements(
                mode, 
                end != -1 ? end - start : this.indices.length - start, 
                this.indices.type, 
                start);
        }
        else {
            this.gl.drawArrays(
                mode, 
                start, 
                end != -1 ? end - start : this.buffers[0].vertexCount - start);
        }
    }
}