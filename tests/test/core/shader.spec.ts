import { describe, it, expect, getContext } from "test";
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


describe('Core.Shader', () => {

    it('should have a WebGlProgram', () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;
        
        const shader = new Shader(context, {
            vertexSource: vertex,
            fragmentSource: fragment
        });
        
        context.checkErrors();
        expect(shader.webGlProgram).toBeInstanceOf(WebGLProgram);
    });
    
    it('should load shaders from files', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const shader = await Shader.fromFiles(context, './assets/simple.vertex.glsl', './assets/simple.fragment.glsl');        

        context.checkErrors();
        expect(shader.webGlProgram).toBeInstanceOf(WebGLProgram);
    });

    it('should throw a compile error',() => {
        const context = getContext();
        context.state.reset();
        const gl = context.webGlRenderingContext;
        
        expect(() => new Shader(context, {
            vertexSource: fragment,
            fragmentSource: vertex
        })).toThrow();
    });

});