import { describe, it, expect } from "test";
import { Renderer, Shader, VertexBuffer, GlBufferUsage, GlDataType, GlPrimitiveType, GlClearFlags } from '@tgl/core';

const vertex1= `attribute vec2 aPosition;
	
void main(void) {
    gl_Position = vec4(aPosition, 1.0, 1.0);
}`;

const fragment1 = `precision mediump float;

void main(void) {
    gl_FragColor = vec4(1, 1, 1, 1);
 }`;

 const vertex2= `attribute vec2 aPosition;
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


describe("VertexBuffer", () => {
    
    it('should render triangle', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new Renderer(canvas);
        const gl = context.handle;
                
        const shader = new Shader(gl, {
            fragmentSource: fragment1,
            vertexSource: vertex1
        });

        const buffer = new VertexBuffer(gl, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [ -0.5,-0.5, 0.5,-0.5, 0,0.5 ],
            attribute: {
                components: 2,
                name: "aPosition",
                type: GlDataType.FLOAT
            }
        });

        shader.enableAttributes(buffer);

        context.clearColor = [0,0,0,1];
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawArrays(GlPrimitiveType.TRIANGLES, 0, 3);

        await expect(gl).toLookLike('./assets/reference/vertex-triangle.png', 87)
    });

    it('should render color triangle', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;

        const context = new Renderer(canvas);
        const gl = context.handle;
                
        const shader = new Shader(gl, {
            fragmentSource: fragment2,
            vertexSource: vertex2
        });

        const buffer = new VertexBuffer(gl, {
            usage: GlBufferUsage.STATIC_DRAW,
            data: [ 
                -0.5,-0.5, 1,0,0,
                0.5,-0.5, 0,1,0,
                0,0.5, 0,0,1
            ],
            attributes: [
                {
                    components: 2,
                    name: "aPosition",
                    type: GlDataType.FLOAT
                },
                {
                    components: 3,
                    name: "aColor",
                    type: GlDataType.FLOAT
                }
            ]
        });

        expect(buffer.vertexSize).toBe(20);

        shader.enableAttributes(buffer);

        context.clearColor = [0,0,0,1];
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);
        gl.drawArrays(GlPrimitiveType.TRIANGLES, 0, 3);

        await expect(gl).toLookLike('./assets/reference/vertex-triangle-color.png', 81)
    });




});