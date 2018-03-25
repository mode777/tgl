import { GlContext } from "./gl-context";
import { GlShaderType, GlTexture, GlTextureBindType, GlShaderParam } from "./constants";

export type UniformValue = WebGLTexture | number | number[] | Float32Array; 

export interface ShaderOptions {
    vertexSource: string,
    fragmentSource: string
}

export class Shader {

    static async fromFiles(gl: WebGLRenderingContext, vertexUrl: string, fragmentUrl: string){
        const strings = await Promise.all((
            await Promise.all([fetch(vertexUrl), fetch(fragmentUrl)]))
                .map(x => x.text()));

        return new Shader(gl, {
            vertexSource: strings[0],
            fragmentSource: strings[1]
        });
    }

    private _handle: WebGLProgram;
    private _uniformLocations: {[name: string]: WebGLUniformLocation} = {};
    private _uniformValues: {[loc: number]: any};
    private _attributes: {[name: string]: number} = {};
    
    constructor(protected _gl: WebGLRenderingContext, options: ShaderOptions) {
        if(!options || !options.fragmentSource || !options.vertexSource)
            throw 'Source files are missing';

        const vertexShader = this._gl.createShader(GlShaderType.VERTEX_SHADER);
        this._gl.shaderSource(vertexShader, options.vertexSource);
        this._gl.compileShader(vertexShader);
        if(!this._gl.getShaderParameter(vertexShader, GlShaderParam.COMPILE_STATUS)){
            throw this._gl.getShaderInfoLog(vertexShader);
        }

        const fragmentShader = this._gl.createShader(GlShaderType.FRAGMENT_SHADER);
        this._gl.shaderSource(fragmentShader, options.fragmentSource);
        this._gl.compileShader(fragmentShader);
        if(!this._gl.getShaderParameter(fragmentShader, GlShaderParam.COMPILE_STATUS)){
            throw this._gl.getShaderInfoLog(fragmentShader);
        }

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
        if(!this._uniformLocations[name]){
            this._uniformLocations[name] = this._gl.getUniformLocation(this._handle, name);
        }
        return this._uniformLocations[name];
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

    setTexture(nameOrLoc: string | number, texture: WebGLTexture, unit: GlTexture) {
        this.use();
        const location = typeof(nameOrLoc) === 'string'
            ? this.getUniformLocationInternal(nameOrLoc)
            : nameOrLoc;
        
        if(this._uniformValues[<number>location] !== texture){
            this._gl.uniform1i(location, unit);
        }
        this._gl.activeTexture(unit);
        this._gl.bindTexture(GlTextureBindType.TEXTURE_2D, texture);
        
        this._uniformValues[<number>location] = texture;
        return location;
    }

    setFloat(nameOrLoc: string | number, value: number) {
        this.use();
        const location = typeof(nameOrLoc) === 'string' 
            ? this.getUniformLocationInternal(nameOrLoc)
            : nameOrLoc;
        
        if(this._uniformValues[<number>location] !== value){
            this._gl.uniform1f(location, value);
        }
        this._uniformValues[<number>location] = value;
        return location;
    }

    setVec2(nameOrLoc: string | number, x: number, y: number) {
        this.use();
        const location = typeof(nameOrLoc) === 'string' 
            ? this.getUniformLocationInternal(nameOrLoc)
            : nameOrLoc;

        this._gl.uniform2f(location, x, y);
        return location
    }

    setVec3(nameOrLoc: string | number, x: number, y: number, z: number) {
        this.use();
        const location = typeof(nameOrLoc) === 'string' 
            ? this.getUniformLocationInternal(nameOrLoc)
            : nameOrLoc;

        this._gl.uniform3f(location, x, y, z);
        return location;
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