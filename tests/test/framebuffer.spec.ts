import { describe, it, expect } from "test";
import { TglContext, Shader, Texture, GlPixelFormat, VertexBuffer, GlBufferUsage, GlDataType, IndexBuffer, GlClearFlags, GlPrimitiveType, GlMagType, Drawable, Framebuffer, GlMinType, GlWrapMode } from '@tgl/core';

const vertex1 = `attribute vec2 aPosition;
	
void main(void) {
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

const fragment1 = `precision mediump float;

void main(void) {
    gl_FragColor = vec4(1, 1, 1, 1);
 }`;

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

describe('Framebuffer', () => {

    it('should render triangle to framebuffer', async () => {        
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        const context = new TglContext(canvas);
        const gl = context.webGlRenderingContext;

        // create a framebuffer texture
        const fbTexture = new Texture(gl, {
            width: 64,
            height: 64,
            filterMag: GlMagType.NEAREST,
            filterMin: GlMinType.NEAREST,
            wrapX: GlWrapMode.CLAMP_TO_EDGE,
            wrapY: GlWrapMode.CLAMP_TO_EDGE
        });

        // set up drawable and render to the framebuffer
        const fbDrawable = new Drawable(gl, {
            buffers: [{
                data: [-0.5,-0.5, 0.5,-0.5, 0,0.5],
                attributes: [{ name: 'aPosition', components: 2 }]
            }],
            shader: {
                vertexSource: vertex1,
                fragmentSource: fragment1 
            },
            framebuffer: {
                colorAttachment: fbTexture.webGlTexture
            }
        });
        context.clearColor = [0, 0, 1, 1];
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        fbDrawable.draw();
        console.log('Framebuffer drawn')
        
        //draw framebuffer texture as a fullscreen quad

        const drawable = new Drawable(gl, {
            shader: {
                fragmentSource: fragment,
                vertexSource: vertex
            },
            buffers: [{
                usage: GlBufferUsage.STATIC_DRAW,
                data: [
                    -1,-1, 0, 0, 
                     1,-1, 1, 0,
                     1, 1, 1, 1,
                    -1, 1, 0, 1
                ],
                attributes: [
                    { components: 2, name: 'aPosition' },
                    { components: 2, name: 'aTexcoord' }
                ]
            }],
            indices: [3, 0, 1, 3, 1, 2],
            textures: {
                'uTexture': fbTexture
            }
        })

        //Framebuffer.bindDefaultFramebuffer(gl);
        //context.clearColor = [0, 0, 0, 1];
        //context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        //drawable.draw()

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });

});