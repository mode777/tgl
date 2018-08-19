import { describe, it, expect, getContext } from "test";
import { Transform2d, Shader2d, Frame, Context2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags, Texture, GlDataType, GlMagType } from '@tgl/core';
import { vec2, mat3, mat4, vec3 } from 'gl-matrix';

describe("2d.Shader", () => {
    
    it('Should render pixel dimensions',async () => {
        const context = getContext();
        context.state.reset();
        context.resize();
        const gl = context.webGlRenderingContext;

        const tex = await Texture.fromFile(context, '../assets/2d/grass_dirt.png', {
            filterMag: GlMagType.NEAREST
        });
        const transform = new Transform2d({
            scaleX: 4,
            scaleY: 4,
            x: 64,
            y: 64,
            originY: 8,
            originX: 8,
            rotation: 1
        });

        var projection = mat3.identity(mat3.create());
        mat3.translate(projection, projection, [-1.0, 1.0])
        mat3.scale(projection, projection, [2.0/320,-2.0/240])
        
        const frame = {
            x: 16,
            y: 0,
            w: 16,
            h: 16
        }

        const drawable = new Drawable(context, {
            shader: new Shader2d(context).tglShader,
            textures: { 'uTexture': tex },
            buffers: [{
                attributes: [
                    { name: 'aPosition', components: 2, dataType: GlDataType.SHORT },
                    { name: 'aTexcoord', components: 2, dataType: GlDataType.SHORT }
                ],
                data: new Int16Array([
                    0, 0, frame.x, frame.y,
                    frame.w, frame.h, frame.x + frame.w,
                    frame.w, 0, frame.y + frame.h, frame.x + frame.w,
                    0, frame.h, frame.y, frame.x, frame.y + frame.h
                ])
            }],
            uniforms: {
                'uTextureSize': [tex.width, tex.height],
                'uProject': projection,
                'uTransform': transform.matrix
            },
            indices: [0,1,2,0,3,1]
        });

        context.state.clearColor([0,0,0,1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        drawable.draw();

        await expect(gl).toLookLike('./assets/reference/2d-shader.png', 99)
    });
});