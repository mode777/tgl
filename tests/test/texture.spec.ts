import { describe, it, expect } from "test";
import { Renderer, Shader, Texture, GlPixelFormat, VertexBuffer, GlBufferUsage, GlDataType, IndexBuffer, GlClearFlags, GlPrimitiveType, GlTextureUnit, GlMagType } from '@tgl/core';

const vertex = `attribute vec2 aPosition;
attribute vec2 aTexcoord;
varying vec2 vTexcoord;
	
void main(void) {
    vTexcoord = aTexcoord;
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

const fragment = `precision mediump float;
uniform sampler2D uTexture;

varying vec2 vTexcoord;

void main(void) {
    gl_FragColor = texture2D(uTexture, vTexcoord);
 }`;

describe("Texture", () => {

    const context = new Renderer(document.createElement('canvas'));
    const gl = context.handle;
    const checker = new Uint8Array([
        0,0,255,255, 
        255,255,0,255,
        255,255,0,255,
        0, 0, 255, 255 
    ]);

    it('should create texture', () => {
        
        const texture = new Texture(gl, {
            source: checker,
            width: 2,
            height: 2
        });
        
        context.checkErrors();
        expect(texture.handle).toBeInstanceOf(WebGLTexture);
    });

    it('should load texture', async () => {        
        const texture = await Texture.fromFile(gl, './assets/grid.png');
        
        context.checkErrors();
        expect(texture.handle).toBeInstanceOf(WebGLTexture);
        expect(texture.width).toBe(256);
        expect(texture.height).toBe(256);
    });

    it('should report the correct size', () => {
        
        const texture = new Texture(gl, {
            source: checker,
            width: 2,
            height: 2
        });
        
        context.checkErrors();
        expect(texture.width).toBe(2);
        expect(texture.height).toBe(2);
    });

    it('should render checkers', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new Renderer(canvas);
        const gl = context.handle;

        const shader = new Shader(gl, {
            fragmentSource: fragment,
            vertexSource: vertex
        });

        const texture = new Texture(gl, {
            source: checker,
            width: 2,
            height: 2,
            filterMag: GlMagType.NEAREST
        });

        const buffer = new VertexBuffer(gl, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [
                -0.5,-0.5, 0,0, 
                 0.5,-0.5, 1,0,
                 0.5, 0.5, 1,1,
                -0.5, 0.5, 0,1
            ],
            attributes: [
                { components: 2, name: 'aPosition' },
                { components: 2, name: 'aTexcoord' }
            ]
        });

        const indices = new IndexBuffer(gl, [3, 0, 1, 3, 1, 2]);

        shader.enableAttributes(buffer);
        shader.setUniform("uTexture", GlTextureUnit.TEXTURE0);

        context.clearColor = [0, 0, 0, 1];

        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawElements(GlPrimitiveType.TRIANGLES, indices.length, indices.type, 0);

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });

});