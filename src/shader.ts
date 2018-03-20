import { GlContext } from "./gl-context";
import { GlShaderType, GlTexture, GlTextureBindType } from "./constants";
import { UniformValue } from "./options";

export class Shader {

    private _handle: WebGLProgram;
    private _uniforms: {[name: string]: WebGLUniformLocation} = {};
    private _attributes: {[name: string]: number} = {};

    constructor(protected _gl: WebGLRenderingContext, vertex: string, pixel: string) {
        const vertexShader = this._gl.createShader(GlShaderType.VERTEX_SHADER);
        this._gl.shaderSource(vertexShader, vertex);
        this._gl.compileShader(vertexShader);

        const fragmentShader = this._gl.createShader(GlShaderType.FRAGMENT_SHADER);
        this._gl.shaderSource(fragmentShader, pixel);
        this._gl.compileShader(fragmentShader);

        const program = this._gl.createProgram();
        this._gl.attachShader(program, vertexShader);
        this._gl.attachShader(program, fragmentShader);
        this._gl.linkProgram(program);

        this._gl.detachShader(program, vertexShader);
        this._gl.detachShader(program, fragmentShader);

        this._gl.deleteShader(vertexShader);
        this._gl.deleteShader(fragmentShader);

        this._gl.useProgram(program);
        this._handle = program;
    }

    get handle() {
        return this._handle;
    }

    use() {
        this._gl.useProgram(this._handle);
    }

    getUniformLocation(name: string) {
        this.use();
        return this.getUniformLocationInternal(name);
    }

    private getUniformLocationInternal(name: string) {
        if(!this._uniforms[name]){
            this._uniforms[name] = this._gl.getUniformLocation(this._handle, name);
        }
        return this._uniforms[name];
    }

    getAttributeLocation(name: string) {
        this.use();
        return this.getAttributeLocationInternal(name);
    }

    private getAttributeLocationInternal(name: string){
        if(!this._attributes[name]){
            this._attributes[name] = this._gl.getAttribLocation(this._handle, name);
        }
        return this._attributes[name];
    }

    setTexture(name: string, texture: WebGLTexture, unit: GlTexture) {
        this.use();
        const location = this.getUniformLocationInternal(name);
        this._gl.uniform1i(location, unit);
        this._gl.activeTexture(unit);
        this._gl.bindTexture(GlTextureBindType.TEXTURE_2D, texture);
    }

    setFloat(name: string, value: number) {
        this.use();
        const location = this.getUniformLocationInternal(name);
        this._gl.uniform1f(location, value);
    }

    setVec2(name: string, x: number, y: number) {
        this.use();
        const location = this.getUniformLocationInternal(name);
        this._gl.uniform2f(location, x, y);
    }

    setVec3(name: string, x: number, y: number, z: number) {
        this.use();
        const location = this.getUniformLocationInternal(name);
        this._gl.uniform3f(location, x, y, z);
    }

    setUniforms(values: { [key: string]: UniformValue }) {
        let unit = GlTexture.TEXTURE0;

        this.use();
        Object.keys(values)
            .map(name => this.getUniformLocationInternal(name))
            .forEach(location => {
                const value = <any>values['location'];
                const length = value['length'];
                const type = typeof (value);

                if (type === 'string') {
                    this._gl.uniform1f(location, value);
                }
                else if (value instanceof WebGLTexture) {
                    this._gl.uniform1i(location, unit);
                    this._gl.activeTexture(unit);
                    this._gl.bindTexture(GlTextureBindType.TEXTURE_2D, value);
                }
                else if (length === 2) {
                    this._gl.uniform2f(location, value[0], value[1]);
                }
                else if (length === 3) {
                    this._gl.uniform3f(location, value[0], value[1], value[2]);
                }
            });
    }
}