import { describe, it, expect, getContext } from "test";
import { TglContext, Shader, Texture, GlPixelFormat, VertexBuffer, GlBufferUsage, GlDataType, IndexBuffer, GlClearFlags, GlPrimitiveType, GlMagType, Drawable, Framebuffer, GlMinType, GlWrapMode, Renderbuffer } from '@tgl/core';

describe('Core.Framebuffer', () => {
 
    it('should have a color attachment', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        // create a framebuffer texture
        const fbTexture = new Texture(context, {
            width: 64,
            height: 64,
            filterMag: GlMagType.NEAREST,
        });

        const framebuffer = new Framebuffer(context, {
            width: fbTexture.width,
            height: fbTexture.height,
            colorAttachment: fbTexture
        });

        expect(framebuffer.colorAttachment).toBe(fbTexture);
    });

    it('should deduct texture size', async () => {
        const context = getContext();
        
        const fb = new Framebuffer(context, {
            colorAttachment: new Texture(context, {
                width: 128,
                height: 128,
            }),
            depthAttachment: new Renderbuffer(context, {
                width: 128,
                height: 128
            })
        })

        expect(fb.height).toBe(128);
        expect(fb.width).toBe(128);
    });

    it('should render triangle to framebuffer', async () => {        
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        // create a framebuffer texture
        const fbTexture = new Texture(context, {
            width: 64,
            height: 64,
            filterMag: GlMagType.NEAREST,
        });

        const framebuffer = new Framebuffer(context, {
            width: fbTexture.width,
            height: fbTexture.height,
            colorAttachment: fbTexture
        })
                
        // set up drawable and render to the framebuffer
        const fbDrawable = new Drawable(context, {
            buffers: [{
                data: [-0.5,-0.5, 0.5,-0.5, 0,0.5],
                attributes: [{ name: 'aPosition', components: 2 }]
            }],
            shader: {
                vertexSource: vertex1,
                fragmentSource: fragment1 
            }
        });

        framebuffer.render(() => {
            context.state.clearColor([0, 0, 1, 1]);
            context.clear(GlClearFlags.COLOR_BUFFER_BIT);
            fbDrawable.draw();
        });
        
        //draw framebuffer texture as a fullscreen quad

        const drawable = new Drawable(context, {
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
        
        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        drawable.draw()
        
        await expect(gl).toLookLike('./assets/reference/framebuffer.png', 100)
    });

});

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