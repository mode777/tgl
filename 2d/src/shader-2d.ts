import { Shader } from '@tgl/core';
import { mat3 } from 'gl-matrix';

export class Shader2d extends Shader {

    private static lastViewport = [0,0,0,0]
    private static projection = mat3.identity(mat3.create());

    public static getProjectionMatrix(viewport: [number, number, number, number]) {
        if(viewport[0] !== this.lastViewport[0] || 
            viewport[1] !== this.lastViewport[1] || 
            viewport[2] !== this.lastViewport[2] || 
            viewport[3] !== this.lastViewport[3])
        {
            mat3.identity(Shader2d.projection);
            mat3.translate(Shader2d.projection, Shader2d.projection, [-1.0, 1.0])
            mat3.scale(Shader2d.projection, Shader2d.projection, [2.0/viewport[2],-2.0/viewport[3]])
            
            this.lastViewport = [...viewport];
        }
        return Shader2d.projection;
    }

    private static _instance: Shader2d; 

    public static getInstance(gl: WebGLRenderingContext){
        if(!Shader2d._instance){
            Shader2d._instance = new Shader2d(gl);
        }

        return Shader2d._instance;
    }

    private constructor(gl: WebGLRenderingContext){
        super(gl, {
            fragmentSource: fragmentShader,
            vertexSource: vertexShader 
        });
    }    
}

const vertexShader = `
attribute vec2 aPosition;
attribute vec2 aTexcoord;

uniform vec2 uTextureSize;
uniform mat3 uTransform;
uniform mat3 uProject;

varying vec2 vTexcoord;
	
void main(void) {
    vec3 transformed =  uProject * uTransform * vec3(aPosition, 1.0);
    vTexcoord = aTexcoord / uTextureSize;
    gl_Position = vec4(transformed, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform sampler2D uTexture;

varying vec2 vTexcoord;

void main(void) {
    gl_FragColor = texture2D(uTexture, vTexcoord);
}
`;