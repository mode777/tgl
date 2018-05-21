import { describe, it, expect } from "test";
import { Transform2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags } from '@tgl/core';
import { vec2 } from 'gl-matrix';

describe("2d.Transform", () => {
    
    it('Test translate', () => {
        const vec = vec2.create();
        
        var trans = new Transform2d({
            x: 10,
            y: -5
        });

        trans.transform(vec,vec);

        expect(vec[0]).toBe(10);
        expect(vec[1]).toBe(-5);
    });

    it('Test scale', () => {
        const vec = vec2.fromValues(2,2)        
        var trans = new Transform2d({
            scaleX: 2,
            scaleY: 0.5
        });

        trans.transform(vec,vec);

        expect(vec[0]).toBe(4);
        expect(vec[1]).toBe(1);
    });

    it('Test origin', () => {
        const vec = vec2.fromValues(2,2)        
        var trans = new Transform2d({
            originX: 1,
            originY: 1
        });

        trans.transform(vec,vec);

        expect(vec[0]).toBe(1);
        expect(vec[1]).toBe(1);
    });

    it('Test rotation', () => {
        const vec = vec2.fromValues(2,2)        
        var trans = new Transform2d({
            rotation: Math.PI/2
        });

        trans.transform(vec,vec);

        expect(vec[0]).toBe(-2);
        expect(vec[1]).toBe(2);
    });

    it('Test all', () => {
        const vec = vec2.fromValues(2,2)        
        var trans = new Transform2d({
            scaleX: 2,
            scaleY: 2,
            originX: 1,
            originY: 1,

        });

        trans.transform(vec,vec);

        expect(vec[0]).toBe(2);
        expect(vec[1]).toBe(2);
    });
    
});