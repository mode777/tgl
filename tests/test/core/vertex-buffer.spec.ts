import { describe, it, expect, getContext } from "test";
import { TglContext, Shader, VertexBuffer, GlBufferUsage, GlDataType, GlPrimitiveType, GlClearFlags, IndexBuffer } from '@tgl/core';

const vertex1 = `attribute vec2 aPosition;
	
void main(void) {
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

const fragment1 = `precision mediump float;

void main(void) {
    gl_FragColor = vec4(1, 1, 1, 1);
 }`;

const vertex2 = `attribute vec2 aPosition;
 attribute vec3 aColor;

 varying vec4 vColor;
	
void main(void) {
    vColor = vec4(aColor, 1.0);
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

const fragment2 = `precision mediump float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
 }`;


describe("Core.VertexBuffer", () => {

    it('should calculate vertex size', async () => {   
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;
        
        const buffer = new VertexBuffer(context, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: new Float32Array([
                -0.5, -0.5, 1,
                0.5, -0.5, 1,
                0, 0.5, 1
            ]),
            attributes: [
                {
                    components: 2,
                    name: "aPosition",
                    dataType: GlDataType.FLOAT
                },
                {
                    components: 4,
                    name: "aColor",
                    dataType: GlDataType.UNSIGNED_BYTE,
                    normalized: true
                }
            ]
        });

        console.log(buffer.webGlBuffer);

        expect(buffer.attributes[1].offset).toBe(8);
        expect(buffer.vertexSize).toBe(12);
        expect(buffer.size).toBe(3 * 12);
        expect(buffer.vertexCount).toBe(3);
    });

    it('should render triangle', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const shader = new Shader(context, {
            fragmentSource: fragment1,
            vertexSource: vertex1
        });

        const buffer = new VertexBuffer(context, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [-0.5, -0.5, 0.5, -0.5, 0, 0.5],
            attributes: [{
                components: 2,
                name: 'aPosition'
            }]
        });

        buffer.enableAttribute('aPosition', shader.getAttributeLocation('aPosition'));

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawArrays(GlPrimitiveType.TRIANGLES, 0, 3);

        await expect(gl).toLookLike('./assets/reference/vertex-triangle.png', 100)
    });

    it('should update data', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const shader = new Shader(context, {
            fragmentSource: fragment1,
            vertexSource: vertex1
        });

        const buffer = new VertexBuffer(context, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: new Float32Array(6),
            attributes: [{
                components: 2,
                name: 'aPosition'
            }]
        });

        const data = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0, 0.5]);

        buffer.subData(0, data);
        buffer.enableAttribute('aPosition', shader.getAttributeLocation('aPosition'));

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawArrays(GlPrimitiveType.TRIANGLES, 0, 3);

        await expect(gl).toLookLike('./assets/reference/vertex-triangle.png', 100)
    });

    it('should render color triangle', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const shader = new Shader(context, {
            fragmentSource: fragment2,
            vertexSource: vertex2
        });

        const buffer = new VertexBuffer(context, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [
                -0.5, -0.5, 1, 0, 0,
                0.5, -0.5, 0, 1, 0,
                0, 0.5, 0, 0, 1
            ],
            attributes: [
                {
                    components: 2,
                    name: "aPosition",
                    dataType: GlDataType.FLOAT
                },
                {
                    components: 3,
                    name: "aColor",
                    dataType: GlDataType.FLOAT
                }
            ]
        });

        expect(buffer.vertexSize).toBe(20);

        buffer.enableAttribute('aPosition', shader.getAttributeLocation('aPosition'));
        buffer.enableAttribute('aColor', shader.getAttributeLocation('aColor'));

        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawArrays(GlPrimitiveType.TRIANGLES, 0, 3);

        await expect(gl).toLookLike('./assets/reference/vertex-triangle-color.png', 99)
    });

    it('should render with index buffer', async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;


        const shader = new Shader(context, {
            fragmentSource: fragment1,
            vertexSource: vertex1
        });

        const buffer = new VertexBuffer(context, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [-0.5,-0.5, 0.5,-0.5, 0.5,0.5, -0.5,0.5],
            attributes: [{
                components: 2,
                name: "aPosition",
                dataType: GlDataType.FLOAT
            }]
        });

        const indices = new IndexBuffer(context, [3, 0, 1, 3, 1, 2]);

        buffer.enableAttribute('aPosition', shader.getAttributeLocation('aPosition'));
        
        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawElements(GlPrimitiveType.TRIANGLES, indices.length, indices.type, 0);

        await expect(gl).toLookLike('./assets/reference/vertex-box.png', 100)
    });

});