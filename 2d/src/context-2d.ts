import { TglContext } from '@tgl/core';
import { Shader2d } from './shader-2d';

export class Context2d {

    private _shader: Shader2d;

    constructor(private context: TglContext) {
        this._shader = new Shader2d(context);
    }

    get tglContext() { return this.context; }
    get shader(): Shader2d { return this._shader; }

}