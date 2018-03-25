import { describe, it } from "test";
import { GlContext } from '@tgl/core';

describe("GlContext", () => {
    
    var canvas = document.createElement('canvas');

    it("should create a rendering context", () => {
        new GlContext(canvas);
    });

});