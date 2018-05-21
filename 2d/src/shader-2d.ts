import { Shader } from '@tgl/core';

export class Shader2d extends Shader {

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
//attribute vec2 aTexcoord;

uniform vec2 uCanvasSize;
uniform vec2 uTextureSize;

varying vec2 vTexcoord;
	
void main(void) {
    //vec2 transformed = (aPosition / (uCanvasSize / 2.0)) - vec2(-1.0,-1.0);
    vec2 transformed = aPosition / vec2(160.0, 120.0) - vec2(1.0, 1.0);
    //vec2 transformed = aPosition;
    //vTexcoord = aTexcoord / uTextureSize;
    //vTexcoord = aTexcoord;
    gl_Position = vec4(transformed, 1.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

//uniform sampler2D uTexture;

//varying vec2 vTexcoord;

void main(void) {
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    //gl_FragColor = texture2D(uTexture, vTexcoord);
 }
`;