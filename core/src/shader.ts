export type UniformValue = number | number[] | Float32Array; 
export type UniformCollection = {[name: string]: UniformValue};

export interface ShaderOptions {
    vertexSource: string,
    fragmentSource: string,
    uniforms?: UniformCollection;
}

interface UniformInfo {
    info: WebGLActiveInfo;
    location: WebGLUniformLocation;
}

export class Shader {

    private static _current: WebGLTexture;
    
    static async fromFiles(gl: WebGLRenderingContext, vertexUrl: string, fragmentUrl: string, uniforms?: UniformCollection){
        const strings = await Promise.all((
            await Promise.all([fetch(vertexUrl), fetch(fragmentUrl)]))
                .map(x => x.text()));

        return new Shader(gl, {
            vertexSource: strings[0],
            fragmentSource: strings[1],
            uniforms: uniforms
        });
    }

    private _handle: WebGLProgram;
    
    private _uniforms: {[name: string]: UniformInfo} = {};
    
    private _attributes: WebGLActiveInfo[] = [];
    private _attributeLocations: {[name: string]: number} = {};
    
    constructor(protected _gl: WebGLRenderingContext, options: ShaderOptions) {
        if(!options || !options.fragmentSource || !options.vertexSource)
            throw 'Source files are missing';

        const vertexShader = this._gl.createShader(_gl.VERTEX_SHADER);
        this._gl.shaderSource(vertexShader, options.vertexSource);
        this._gl.compileShader(vertexShader);
        if(!this._gl.getShaderParameter(vertexShader, _gl.COMPILE_STATUS)){
            throw this._gl.getShaderInfoLog(vertexShader);
        }

        const fragmentShader = this._gl.createShader(_gl.FRAGMENT_SHADER);
        this._gl.shaderSource(fragmentShader, options.fragmentSource);
        this._gl.compileShader(fragmentShader);
        if(!this._gl.getShaderParameter(fragmentShader, _gl.COMPILE_STATUS)){
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

        this._handle = program;
        
        this.use();
        this.collectAttributeInformation();
        this.collectUniformInformation();
    }

    get handle() {
        return this._handle;
    }

    use() {
        if(Shader._current !== this._handle){
            this._gl.useProgram(this._handle);
            Shader._current = this._handle;
        }
    }

    getUniformLocation(name: string) {
        return this._uniforms[name].location;
    }

    getAttributeLocation(name: string) {
        return this._attributeLocations[name];
    }
    
    setUniforms(uniforms: UniformCollection)
    {
        for (const name in uniforms) {
            if (uniforms.hasOwnProperty(name)) {
                this.setUniform(name, uniforms[name]);                
            }
        }
    }

    setUniform(name: string, value: UniformValue){
        const uniform = this._uniforms[name];
        if(uniform === undefined)
            throw `Unknown uniform: "${name}"`;
            
        switch (uniform.info.type) {
            case this._gl.FLOAT:
            this.setFloat(uniform.location, <number>value);
                break;
                case this._gl.FLOAT_VEC2:
                this.setVec2(uniform.location, <number[]>value);
                break;
            case this._gl.FLOAT_VEC3:
            this.setVec3(uniform.location, <number[]>value);
                break;
                case this._gl.FLOAT_VEC4:
                this.setVec4(uniform.location, <number[]>value);        
                break;
                case this._gl.FLOAT_MAT2:
                this.setMat2(uniform.location, <number[]>value);        
                break;
            case this._gl.FLOAT_MAT3:
            this.setMat3(uniform.location, <number[]>value);        
            break;
            case this._gl.FLOAT_MAT4:                
                this.setMat4(uniform.location, <number[]>value);        
                break;
                case this._gl.SAMPLER_2D:
                this.setTextureUnit(uniform.location, <number>value);
                break;
            default:
            throw `Unsupported data type for uniform: ${uniform.info.name}.`;
        }
    }

    setFloat(loc: WebGLUniformLocation, value: number){
        this.use();
        this._gl.uniform1f(loc, value);
    }
    
    setVec2(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform2fv(loc, arr);
    }
    
    setVec3(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform3fv(loc, arr);
    }
    
    setVec4(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform4fv(loc, arr);
    }
    
    setMat2(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix2fv(loc, false, arr);
    }
    
    setMat3(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix3fv(loc, false, arr);
    }
    
    setMat4(loc: WebGLUniformLocation, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix4fv(loc, false, arr);
    }
    
    setTextureUnit(loc: WebGLUniformLocation, unit: number){
        this.use();
        this._gl.uniform1i(loc, unit);
    }
    
    delete(){
        this._gl.deleteProgram(this._handle);
    }
    
    private getParameter(param: number){
        return this._gl.getProgramParameter(this._handle, param)
    }

    private collectUniformInformation(){
        const uniforms = <any>this.getParameter(this._gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniforms; i++) {
            const info = this._gl.getActiveUniform(this._handle, i);
            const loc = this._gl.getUniformLocation(this._handle, info.name);
            this._uniforms[info.name] = {
                info: info,
                location: loc
            };
        }
    }

    private collectAttributeInformation(){
        const attributes = <any>this.getParameter(this._gl.ACTIVE_ATTRIBUTES);
        
        for (let i = 0; i < attributes; i++) {
            const info = this._gl.getActiveAttrib(this._handle, i);
            this._attributeLocations[info.name] = i;
            this._attributes.push(info);
        }
    }

}