import { vec2, mat3 } from 'gl-matrix';

export interface Transform2dOptions {
    x?: number;
    y?: number;
    originX?: number;
    originY?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
}

export interface Transform2dCreateOptions extends Transform2dOptions {
    enableScale?: boolean;
    enableRotation?: boolean;
    enableTranslation?: boolean;
    enableOrigin?: boolean;
}

const defaultOptions: Transform2dCreateOptions = {
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    enableScale: true,
    enableRotation: true,
    enableTranslation: true,
    enableOrigin: true
}

export class Transform2d {
    
    private _translation = mat3.create()
    private _origin = mat3.create()
    private _rotation = mat3.create()
    private _scale = mat3.create()
    private _rotationValue = 0;

    private _matrix = mat3.create();
    private _dirty = true;

    private _enableTranslation;
    private _enableRotation;
    private _enableOrigin;
    private _enableScale;
    

    constructor(options: Transform2dCreateOptions = {}){
        this._enableOrigin = !!options.enableOrigin;
        this._enableRotation = !!options.enableRotation;
        this._enableScale = !!options.enableScale;
        this._enableTranslation = !!options.enableTranslation;
        this.reset(options)
    }

    public set x(value: number){ this._translation[6] = value; this._dirty = true; }
    public get x(){ return this._translation[6]; }

    public set y(value: number){ this._translation[7] = value; this._dirty = true; }
    public get y(){ return this._translation[7]; }

    public set originX(value: number){ this._origin[6] = -value; this._dirty = true; }
    public get originX(){ return -this._origin[6]; }

    public set originY(value: number){ this._origin[7] = -value; this._dirty = true; }   
    public get originY(){ return -this._origin[7]; }   

    public set scaleX(value: number){ this._scale[0] = value; this._dirty = true; }
    public get scaleX(){ return this._scale[0]; }

    public set scaleY(value: number){ this._translation[4] = value; this._dirty = true; }
    public get scaleY(){ return this._scale[4]; }

    public set rotation(value: number){ mat3.fromRotation(this._rotation,value); this._rotationValue = value; this._dirty = true; }
    public get rotation(){ return this._rotationValue; }

    public get matrix() {  
        if(this._dirty){
            this.buildMatrix();
            this._dirty = false;
        }

        return this._matrix;
    }

    public reset(options: Transform2dOptions = {}){
        const opt = { ...defaultOptions, ...options };

        this._translation = mat3.fromTranslation(this._translation, [opt.x,opt.y])
        this._origin = mat3.fromTranslation(this._origin, [-opt.originX,-opt.originY])
        this._rotation = mat3.fromRotation(this._rotation, opt.rotation);
        this._scale = mat3.fromScaling(this._scale, [opt.scaleX,opt.scaleY]);

        this._rotationValue = opt.rotation;

        this._dirty = true;
    }

    private buildMatrix(){
        mat3.identity(this._matrix)
        mat3.multiply(this._matrix, this._matrix, this._origin);
        mat3.multiply(this._matrix, this._matrix, this._rotation);
        mat3.multiply(this._matrix, this._matrix, this._scale);
        mat3.multiply(this._matrix, this._matrix, this._translation);
    }

    public transform(out: vec2, vector: vec2 | number[]){
        vec2.transformMat3(out, vector, this.matrix)
    }
}