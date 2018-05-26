import { describe, it, expect } from "test";
import { Transform2d } from  '@tgl/2d';
import { TglContext, Shader, Drawable, GlClearFlags } from '@tgl/core';

describe("2d.Transform", () => {
    
    it('Should translate vector', () => {
       
        var trans = new Transform2d({
            x: 10,
            y: -5
        });

        console.log(trans)
        const vec = trans.transform(0,0);

        expect(vec[0]).toBe(10);
        expect(vec[1]).toBe(-5);
    });

    it('Should scale vector', () => {
        var trans = new Transform2d({
            scaleX: 2,
            scaleY: 0.5
        });

        const vec = trans.transform(2,2);

        expect(vec[0]).toBe(4);
        expect(vec[1]).toBe(1);
    });

    it('Should translate origin', () => {
        var trans = new Transform2d({
            originX: 1,
            originY: 1
        });

        const vec = trans.transform(2,2);

        expect(vec[0]).toBe(1);
        expect(vec[1]).toBe(1);
    });

    it('Should rotate vector', () => {
        var trans = new Transform2d({
            rotation: Math.PI/2
        });

        const vec = trans.transform(2,2);

        expect(Math.round(vec[0])).toBe(-2);
        expect(Math.round(vec[1])).toBe(2);
    });

    it('Should transfrom vector', () => {
        var trans = new Transform2d({
            scaleX: 2,
            scaleY: 2,
            originX: 1,
            originY: 1,
            rotation: Math.PI/2,
            x: 2,
            y: -2
        });

        const vec = trans.transform(2,2);

        expect(Math.round(vec[0])).toBe(0);
        expect(Math.round(vec[1])).toBe(0);
    });
    
});