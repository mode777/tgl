import { Shader, TglContext, Texture, GlDataType, AttributeOptions } from '@tgl/core';
import { mat3 } from 'gl-matrix';

export class Shader2d {

    readonly tglShader: Shader;
    readonly attributes: AttributeOptions[] = [
        { name: 'aPosition', components: 2, dataType: GlDataType.SHORT },
        { name: 'aTexcoord', components: 2, dataType: GlDataType.SHORT }
    ];

    private projection = mat3.identity(mat3.create());

    public constructor(private context: TglContext){
        this.tglShader = new Shader(context, {
            vertexSource: vertexShader,
            fragmentSource: fragmentShader
        });        
        this.setProjectionMatrix(this.context.state.viewport());
        context.state.on('viewport', (vp) => this.setProjectionMatrix(vp));
    }    

    set modelMatrix(value: Float32Array) { 
        this.tglShader.setMat3(
            this.tglShader.getUniformLocation('uTransform'), value) 
    };
    
    set textureSize(value: [number, number]) { 
        this.tglShader.setVec2(
            this.tglShader.getUniformLocation('uTextureSize'), value) 
    };
    
    set texture(value: Texture) { 
        var unit = value.bind(0);
        this.tglShader.setUniform('uTexture', unit);
    }

    private setProjectionMatrix(viewport: [number, number, number, number]){
        mat3.identity(this.projection);
        mat3.translate(this.projection, this.projection, [-1.0, 1.0])
        mat3.scale(this.projection, this.projection, [2.0/viewport[2],-2.0/viewport[3]])
        this.tglShader.setMat3(this.tglShader.getUniformLocation('uProject'), this.projection);
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