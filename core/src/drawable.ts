import { BufferOptions, VertexBuffer } from './vertex-buffer';
import { Texture, TextureOptions } from './texture';
import { Shader, ShaderOptions, UniformValue } from './shader';
import { IndexBuffer } from './index-buffer';
import { GlPrimitiveType } from './constants/gl-primitive-type';

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
    private _buffers: VertexBuffer[] = [];
    private _shader: Shader;
    private _indices: IndexBuffer = null;
    private _textures: {[key:string]: Texture } = {};
    private _uniforms: {[key:string]: UniformValue};

    /**
     * Creates a new drawable instance
     * @param _gl A WebGL rendering context
     * @param _options Options object to initialize drawable with. 
     */
    constructor(protected _gl: WebGLRenderingContext, private _options: DrawableOptions){
        if(_options.buffers.length === 0)
            throw 'You need at least one buffer to draw.';

        this._buffers = _options.buffers.map(x => x instanceof VertexBuffer 
            ? x 
            : new VertexBuffer(_gl, x));
        this._shader = _options.shader instanceof Shader 
            ? _options.shader 
            : new Shader(_gl, _options.shader);
        this._indices = _options.indices !== undefined 
            ? (_options.indices instanceof IndexBuffer 
                ? _options.indices
                : new IndexBuffer(_gl, _options.indices)) 
            : null;
        Object.keys(_options.textures || {}).forEach(name => {
            const tex = _options.textures[name];
            this._textures[name] = _options.textures[name] instanceof Texture 
                ? <Texture>_options.textures[name]
                : new Texture(_gl, <TextureOptions>_options.textures[name])
        });
        this._uniforms = this._options.uniforms ? {..._options.uniforms} : {};
    }
    
    /**
     * Draw to the current framebuffer.
     * Automatically sets up attributes, uniforms, buffer etc..
     * @param mode Type of rendering primitives to draw. Default = TRIANGLES
     * @param start First vertex to draw. Default = 0
     * @param end Last vertex to draw. Default = -1 (all)
     */
    draw(mode: GlPrimitiveType = GlPrimitiveType.TRIANGLES, start: number = 0, end: number = -1){
        this._shader.use();
        this._buffers.forEach(x => 
            x.attributes.forEach(y => 
                x.enableAttribute(y.name, this._shader.getAttributeLocation(y.name))));
        
        let i = 0;
        for (const name in this._textures) {
            if  (this._textures.hasOwnProperty(name)) {
                const unit = this._textures[name].bind(i);
                this._shader.setUniform(name, unit);
                i++;
            }
        }
        this._shader.setUniforms(this._uniforms);
    
        if(this._indices !== null){
            this._indices.bind();
            this._gl.drawElements(
                mode, 
                end != -1 ? end - start : this._indices.length - start, 
                this._indices.type, 
                start);
        }
        else {
            this._gl.drawArrays(
                mode, 
                start, 
                end != -1 ? end - start : this._buffers[0].vertexCount - start);
        }
    }
}