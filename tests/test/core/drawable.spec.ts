import { describe, it, expect, getContext } from "test";
import { TglContext, Shader, VertexBuffer, IndexBuffer, Drawable, Texture, BufferOptions, GlBufferUsage, GlMagType, GlClearFlags } from '@tgl/core';

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

describe("Core.Drawable", () => {
    
    const checker = new Uint8Array([
        0,0,255,255, 
        255,255,0,255,
        255,255,0,255,
        0, 0, 255, 255 
    ]);
    const bufferOptions: BufferOptions = {
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
    };

    const shaderOptions = {
        fragmentSource: fragment,
        vertexSource: vertex
    }

    const textureOptions = {
        source: checker,
        width: 2,
        height: 2,
        filterMag: GlMagType.NEAREST
    }

    const indices = [3, 0, 1, 3, 1, 2];

    it('should render checkers from options', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const drawable = new Drawable(gl, {
            buffers: [bufferOptions],
            shader: shaderOptions,
            indices: indices,
            textures: {
                'uTexture': textureOptions 
            }
        });

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });

    it('should render checkers from objects', async () => {
        const context = getContext();
        const gl = context.webGlRenderingContext;

        const drawable = new Drawable(gl, {
            buffers: [new VertexBuffer(gl, bufferOptions)],
            shader: new Shader(gl, shaderOptions),
            indices: new IndexBuffer(gl, indices),
            textures: {
                'uTexture': new Texture(gl, textureOptions)
            }
        });

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });

    it('should render from multiple buffers', async () => {
        const context = getContext();
        const gl = context.webGlRenderingContext;

        const drawable = new Drawable(gl, {
            buffers: [{
                data: [
                    -0.5,-0.5, 
                     0.5,-0.5,
                     0.5, 0.5,
                    -0.5, 0.5
                ],
                attributes: [{ name: 'aPosition', components: 2 }]
            }, {
                data: [
                    0,0, 
                    1,0,
                    1,1,
                    0,1
                ],
                attributes: [{ name: 'aTexcoord', components: 2 }]
            }],
            shader: shaderOptions,
            indices: indices,
            textures: {
                'uTexture': textureOptions
            }
        });

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/texture-checker.png', 100)
    });

    it('should render a simple triangle', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();        
        const gl = context.webGlRenderingContext;

        const drawable = new Drawable(gl, {
            buffers: [{
                data: [-0.5,-0.5, 0.5,-0.5,0, 0.5],
                attributes: [{ name: 'aPosition', components: 2 }]
            }],
            shader: await Shader.fromFiles(gl, './assets/simple.vertex.glsl', './assets/simple.fragment.glsl')
        });

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/vertex-triangle.png', 100)
    });

});