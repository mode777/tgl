import { GlClearFlags } from "./constants";
export declare class GlContext {
    private static _current;
    static getCurrent(): GlContext;
    private _handle;
    private _canvas;
    constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes);
    readonly handle: WebGLRenderingContext;
    readonly canvas: HTMLCanvasElement;
    clear(flags?: GlClearFlags, r?: number, g?: number, b?: number, a?: number): void;
}
