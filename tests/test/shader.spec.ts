import { describe, it, expect } from "test";
import { TglContext, Shader } from '@tgl/core';
const vertex =
`attribute vec3 coordinates;
	
void main(void) {
    gl_Position = vec4(coordinates, 1.0);
}`;
const fragment = 
`void main(void) {
    gl_FragColor = vec4(1, 0.5, 0.0, 1);
 }`;
 const false_fragment = 
 `void main(void) {
     gl_FragColor = vec2(1, 0.5, 0.0, 1);
  }`;


describe('Shader', () => {

    it('should have a WebGlProgram', () => {
        const context = new TglContext(document.createElement('canvas'));
        const gl = context.webGlRenderingContext;
        
        const shader = new Shader(gl, {
            vertexSource: vertex,
            fragmentSource: fragment
        });
        
        context.checkErrors();
        expect(shader.webGlProgram).toBeInstanceOf(WebGLProgram);
    });
    
    it('should load shaders from files', async () => {
        const context = new TglContext(document.createElement('canvas'));
        const gl = context.webGlRenderingContext;
        
        const shader = await Shader.fromFiles(gl, './assets/simple.vertex.glsl', './assets/simple.fragment.glsl');        

        context.checkErrors();
        expect(shader.webGlProgram).toBeInstanceOf(WebGLProgram);
    });

    it('should throw a compile error',() => {
        const context = new TglContext(document.createElement('canvas'));
        const gl = context.webGlRenderingContext;
        
        expect(() => new Shader(gl, {
            vertexSource: fragment,
            fragmentSource: vertex
        })).toThrow();
    });

});