import { BufferOptions, VertexBuffer } from './vertex-buffer';
import { Texture, TextureOptions } from './texture';
import { Shader, ShaderOptions, UniformValue } from './shader';
import { IndexBuffer } from './index-buffer';
import { GlPrimitiveType } from './constants/gl-primitive-type';

export interface DrawableOptions {
    buffers: (VertexBuffer | BufferOptions)[],
    shader: Shader | ShaderOptions
    indices?: IndexBuffer | number[] | Uint16Array;
    textures?: {[key:string]: Texture | TextureOptions }
    uniforms?: {[key:string]: UniformValue }
}

export class Drawable {

    private _buffers: VertexBuffer[] = [];
    private _shader: Shader;
    private _indices: IndexBuffer = null;
    private _textures: {[key:string]: Texture } = {};
    private _uniforms: {[key:string]: UniformValue};

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