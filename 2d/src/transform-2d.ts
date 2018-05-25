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
    private _x: number;
    private _y: number;
    private _ox: number;
    private _oy: number;
    private _rotationValue = 0;
    private _sin: number;
    private _cos: number;
    private _sx: number;
    private _sy: number;

    private _matrix = mat3.identity(mat3.create());
    private _dirty = true;

    private _enableTranslation;
    private _enableRotation;
    private _enableOrigin;
    private _enableScale;

    constructor(options: Transform2dCreateOptions = {}){
        const opt = { ...defaultOptions, ...options };

        this._enableOrigin = opt.enableOrigin;
        this._enableScale = opt.enableScale;
        this._enableRotation = opt.enableRotation;
        this._enableTranslation = opt.enableTranslation;
        this.resetInternal(opt)
    }

    public set x(value: number){ 
        this._x = value; 
        this._dirty = true; 
    }
    public get x(){ return this._x; }

    public set y(value: number){ 
        this._y = value; 
        this._dirty = true; 
    }
    public get y(){ return this._y; }

    public set originX(value: number){ 
        this._ox = value; 
        this._dirty = true; 
    }
    public get originX(){ return this._ox; }

    public set originY(value: number){ 
        this._oy = value; 
        this._dirty = true; 
    }   
    public get originY(){ return this._oy; }   

    public set scaleX(value: number){ 
        this._sx = value; 
        this._dirty = true; 
    }
    public get scaleX(){ return this._sx; }

    public set scaleY(value: number){ 
        this._sy = value; 
        this._dirty = true; 
    }
    public get scaleY(){ return this._sy; }

    public set rotation(value: number){ 
        this._sin = Math.sin(value); 
        this._cos = Math.cos(value); 
        this._rotationValue = value; 
        this._dirty = true; 
    }
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
        this.resetInternal(opt);
    }

    public transform(out: vec2, vector: vec2 | number[]){
        vec2.transformMat3(out, vector, this.matrix)
    }

    private resetInternal(opt: Transform2dOptions){
        this.x = opt.x;
        this.y = opt.y;
        this.scaleX = opt.scaleX;
        this.scaleY = opt.scaleY;
        this.originX = opt.originX;
        this.originY = opt.originY;
        this.rotation = opt.rotation;

        this._dirty = true;
    }

    private buildMatrix(){
        const cos = this._cos;
        const sin = this._sin;
        const sx = this._sx;
        const sy = this._sy;
        const ox = this._ox;
        const oy = this._oy;

        this._matrix[0] = sx * cos;
        this._matrix[1] = sx * sin;
        this._matrix[3] = sy * -sin;
        this._matrix[4] = sy * cos;
        this._matrix[6] = -ox * sx * cos + -oy * sy * -sin + this._x;
        this._matrix[7] = -ox * sx * sin + -oy * sy * cos + this._y;
    }
}