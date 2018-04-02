import { GlShaderType, GlTexture, GlTextureBindType, GlShaderParam, GlProgramParam, GlUniformType } from "./constants";
import { VertexBuffer } from "./vertex-buffer";

export type UniformValue = number | number[] | Float32Array; 
export type UniformCollection = {[name: string]: UniformValue};

export interface ShaderOptions {
    vertexSource: string,
    fragmentSource: string,
    uniforms?: UniformCollection;
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
    
    private _uniforms: WebGLActiveInfo[] = [];
    private _uniformLocations: {[name: string]: number} = {};
    
    private _attributes: WebGLActiveInfo[] = [];
    private _attributeLocations: {[name: string]: number} = {};
    
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

    // bindAttributeLocation(index: number, name: string){
    //     this._gl.bindAttribLocation(this._handle, index, name)
    // }

    getUniformLocation(name: string) {
        return this._uniformLocations[name];
    }

    getAttributeLocation(name: string) {
        return this._attributeLocations[name];
    }

    getParameter(param: GlProgramParam){
        return this._gl.getProgramParameter(this._handle, param)
    }

    enableAttributes(buffer: VertexBuffer){
        buffer.bind();
        this.use();

        buffer.attributes.forEach(a => {
            this._gl.enableVertexAttribArray(this._attributeLocations[a.name]);
            this._gl.vertexAttribPointer(
                this._attributeLocations[a.name],
                a.components,
                a.dataType,
                a.normalized,
                buffer.vertexSize,
                a.offset);
        });
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
        const loc = this._uniformLocations[name];
        const info = this._uniforms[loc];
        
        switch (info.type) {
            case GlUniformType.FLOAT:
                this.setFloat(loc, <number>value);
                break;
            case GlUniformType.FLOAT_VEC2:
                this.setVec2(loc, <number[]>value);
                break;
            case GlUniformType.FLOAT_VEC3:
                this.setVec3(loc, <number[]>value);
                break;
            case GlUniformType.FLOAT_VEC4:
                this.setVec4(loc, <number[]>value);        
                break;
            case GlUniformType.FLOAT_MAT2:
                this.setMat2(loc, <number[]>value);        
                break;
            case GlUniformType.FLOAT_MAT3:
                this.setMat3(loc, <number[]>value);        
                break;
            case GlUniformType.FLOAT_MAT4:                
                this.setMat4(loc, <number[]>value);        
                break;
            case GlUniformType.SAMPLER_2D:
                this.setTextureUnit(loc, <number>value);
                break;
            default:
                throw `Setting data type ${GlUniformType[info.type]} not yet supported.`;
        }
    }

    setFloat(loc: number, value: number){
        this.use();
        this._gl.uniform1f(loc, value);
    }
    
    setVec2(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform2fv(loc, arr);
    }
    
    setVec3(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform3fv(loc, arr);
    }
    
    setVec4(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniform4fv(loc, arr);
    }
    
    setMat2(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix2fv(loc, false, arr);
    }
    
    setMat3(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix3fv(loc, false, arr);
    }
    
    setMat4(loc: number, arr: Float32Array | number[]){
        this.use();
        this._gl.uniformMatrix4fv(loc, false, arr);
    }
    
    setTextureUnit(loc: number, unit: GlTexture){
        this.use();
        this._gl.uniform1i(loc, unit);
    }
    
    delete(){
        this._gl.deleteProgram(this._handle);
    }

    private collectUniformInformation(){
        const uniforms = <any>this.getParameter(GlProgramParam.ACTIVE_UNIFORMS);

        for (let i = 0; i < uniforms; i++) {
            const info = this._gl.getActiveUniform(this._handle, i);
            this._uniformLocations[info.name] = i;
            this._uniforms.push(info);
        }
    }

    private collectAttributeInformation(){
        const attributes = <any>this.getParameter(GlProgramParam.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < attributes; i++) {
            const info = this._gl.getActiveAttrib(this._handle, i);
            this._attributeLocations[info.name] = i;
            this._attributes.push(info);
        }
    }

}