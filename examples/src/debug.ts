import { TglContext, GlClearFlags, Drawable, GlPrimitiveType, GlDataType } from "@tgl/core";
import { Shader2d } from '@tgl/2d';

async function main(){
    const context = new TglContext({
        width: 512,
        height: 512
    });
    document.body.appendChild(context.canvas);
    const gl = context.webGlRenderingContext;
    
    const drawable = new Drawable(gl, {
        buffers: [{
            attributes: [{ name: 'aPosition', components: 2, type: GlDataType.SHORT }],
            data: [0,0, 50,50, 50,0]
        }, {
            attributes: [{ name: 'aColor', components: 4, type: GlDataType.UNSIGNED_BYTE, normalized: true }],
            data: [0,255,255,255, 255,0,255,255, 255,255,0,255 ]
        }],
        indices: [0,1,1,2,2,0],
        shader: { 
            fragmentSource: fragmentShader,
            vertexSource: vertexShader,
        },
        uniforms: {
            uProject: Shader2d.getProjectionMatrix(context.state.viewport())
        }
    });
    
    context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);

    drawable.draw(GlPrimitiveType.LINES)
}

const vertexShader = `
attribute vec2 aPosition;
attribute vec4 aColor;

uniform mat3 uProject;

varying vec4 vColor;
	
void main(void) {
    vec3 transformed =  uProject * vec3(aPosition, 1.0);
    vColor = aColor;
    gl_Position = vec4(transformed, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}
`;

main();