import { TglState } from './tgl-state';

/** Represents a valid value for an uniform in TGL */
export type UniformValue = number | number[] | Float32Array; 
/** An uniform object, where the keys correspond to uniform values in the shader */
export type UniformCollection = {[name: string]: UniformValue};
/** Describes a shader configuration */
export interface ShaderOptions {
    /** String with the vertex shader programm */
    vertexSource: string,
    /** String with the fragment shader programm */
    fragmentSource: string,
    /** Uniform values to initialize the shader with */
    uniforms?: UniformCollection;
}

interface UniformInfo {
    info: WebGLActiveInfo;
    location: WebGLUniformLocation;
}

/** Describes a shader programm, which can be used for drawing. */
export class Shader {

    private state = TglState.getCurrent(this.gl);
    
    /** Loads shader sources from files via the fetch API
     * and initializes the shader with them.
     * @param gl Rendering context.
     * @param vertexUrl Url to the vertex shader file.
     * @param fragmentUrl Url to the fragment shader file.
     * @param options Additional shader options. */
    static async fromFiles(gl: WebGLRenderingContext, vertexUrl: string, fragmentUrl: string, options?: Partial<ShaderOptions>){
        const strings = await Promise.all((
            await Promise.all([fetch(vertexUrl), fetch(fragmentUrl)]))
                .map(x => x.text()));

        return new Shader(gl, {
            ...(options || {}),
            vertexSource: strings[0],
            fragmentSource: strings[1],
        });
    }

    private handle: WebGLProgram;    
    private uniforms: {[name: string]: UniformInfo} = {};
    private attributes: WebGLActiveInfo[] = [];
    private attributeLocations: {[name: string]: number} = {};
    
    /** Creates a new Shader
     * @param gl Rendering context
     * @param options Options to initialize the shader with. See {@link ShaderOptions}. */
    constructor(protected gl: WebGLRenderingContext, options: ShaderOptions) {
        if(!options || !options.fragmentSource || !options.vertexSource)
            throw 'Source files are missing';

        const vertexShader = this.gl.createShader(gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader, options.vertexSource);
        this.gl.compileShader(vertexShader);
        if(!this.gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
            throw this.gl.getShaderInfoLog(vertexShader);
        }

        const fragmentShader = this.gl.createShader(gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader, options.fragmentSource);
        this.gl.compileShader(fragmentShader);
        if(!this.gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
            throw this.gl.getShaderInfoLog(fragmentShader);
        }

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        this.gl.detachShader(program, vertexShader);
        this.gl.detachShader(program, fragmentShader);

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        this.handle = program;
        
        this.use();
        this.collectAttributeInformation();
        this.collectUniformInformation();
        if(options.uniforms){
            this.setUniforms(options.uniforms);
        }
    }

    /** Handle to the native WebGL program. */
    get webGlProgram() {
        return this.handle;
    }

    /** Use this shader if it is not currently in use. */
    use() {
        this.state.program(this.handle);
    }

    /** Returns the WebGLUniformLocation for a uniform variable name in the shader.
     * Calling this method has no performance caveat. */
    getUniformLocation(name: string) {
        return this.uniforms[name].location;
    }

    /** Returns the attribute index for a attribute variable name in the shader. 
     * Calling this method has no performance caveat. */
    getAttributeLocation(name: string) {
        return this.attributeLocations[name];
    }
    
    /** Set multiple uniforms from a {@link UniformCollection}
     * @param uniforms Key is the uniform name, value the uniform value to set. */
    setUniforms(uniforms: UniformCollection)
    {
        for (const name in uniforms) {
            if (uniforms.hasOwnProperty(name)) {
                this.setUniform(name, uniforms[name]);                
            }
        }
    }

    /** Set a single uniform by name.
     * @param name Name of the uniform variable in the shader
     * @param value Value to set */
    setUniform(name: string, value: UniformValue){
        const uniform = this.uniforms[name];
        if(uniform === undefined)
            throw `Unknown uniform: "${name}"`;
            
        switch (uniform.info.type) {
            case this.gl.FLOAT:
                this.setFloat(uniform.location, <number>value);
                break;
            case this.gl.FLOAT_VEC2:
                this.setVec2(uniform.location, <number[]>value);
                break;
            case this.gl.FLOAT_VEC3:
                this.setVec3(uniform.location, <number[]>value);
                break;
            case this.gl.FLOAT_VEC4:
                this.setVec4(uniform.location, <number[]>value);        
                break;
            case this.gl.FLOAT_MAT2:
                this.setMat2(uniform.location, <number[]>value);        
                break;
            case this.gl.FLOAT_MAT3:
                this.setMat3(uniform.location, <number[]>value);        
                break;
            case this.gl.FLOAT_MAT4:                
                this.setMat4(uniform.location, <number[]>value);        
                break;
            case this.gl.SAMPLER_2D:
                this.setTextureUnit(uniform.location, <number>value);
                break;
            default:
                throw `Unsupported data type for uniform: ${uniform.info.name}.`;
        }
    }

    /** Send a float to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param value value to send */
    setFloat(loc: WebGLUniformLocation, value: number){
        this.use();
        this.gl.uniform1f(loc, value);
    }
    
    /** Send a Vector2 to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Vector as an array */
    setVec2(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniform2fv(loc, arr);
    }
    
    /** Send a Vector3 to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Vector as an array */
    setVec3(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniform3fv(loc, arr);
    }
    
    /** Send a Vector4 to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Vector as an array */
    setVec4(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniform4fv(loc, arr);
    }
    
    /** Send a 2x2 Matrix to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Array representing the matrix */
    setMat2(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniformMatrix2fv(loc, false, arr);
    }
    
    /** Send a 3x3 Matrix to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Array representing the matrix */
    setMat3(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniformMatrix3fv(loc, false, arr);
    }
    
    /** Send a 4x4 Matrix to the shader.
     * @param loc WebGLUniformLocation of the variable.
     * @param arr Array representing the matrix */
    setMat4(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this.gl.uniformMatrix4fv(loc, false, arr);
    }
    
    /** Bind a texture unit to a Sampler2D variable,
     * @param loc WebGLUniformLocation of the variable.
     * @param unit Index of Texture unit (zero-based) */
    setTextureUnit(loc: WebGLUniformLocation, unit: number){
        this.use();
        this.gl.uniform1i(loc, unit);
    }
    
    /** Delete the underlying WebGLProgramm */
    delete(){
        this.gl.deleteProgram(this.handle);
    }

    private getParameter(param: number){
        return this.gl.getProgramParameter(this.handle, param)
    }

    private collectUniformInformation(){
        const uniforms = <any>this.getParameter(this.gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniforms; i++) {
            const info = this.gl.getActiveUniform(this.handle, i);
            const loc = this.gl.getUniformLocation(this.handle, info.name);
            this.uniforms[info.name] = {
                info: info,
                location: loc
            };
        }
    }

    private collectAttributeInformation(){
        const attributes = <any>this.getParameter(this.gl.ACTIVE_ATTRIBUTES);
        
        for (let i = 0; i < attributes; i++) {
            const info = this.gl.getActiveAttrib(this.handle, i);
            this.attributeLocations[info.name] = i;
            this.attributes.push(info);
        }
    }

}