import { ISprite, Frame, FlipFlags } from './common';
import { Transform2d } from './main';

export abstract class BaseSprite implements ISprite {
 
    constructor(protected frame: Frame, protected transform: Transform2d){

    }

    abstract get boundingBox();
    abstract flip(flags: FlipFlags);
    abstract flipTo(flags: FlipFlags);

    protected abstract setDirty();
 
    public center(x = true, y = true) {
        if(x)
            this.transform.originX = this.frame[2] / 2;
        if(y)
            this.transform.originY = this.frame[3] / 2;

        this.setDirty();
        
        return this;
    }

    protected calculateBoundingBox(bbox: Frame) {
        const a = this.transform.transform(0,0);
        const b = this.transform.transform(this.frame[2],0);
        const c = this.transform.transform(this.frame[2],this.frame[3]);
        const d = this.transform.transform(0,this.frame[3]);

        bbox[0] = Math.min(a[0], b[0], c[0], d[0]);
        bbox[1] = Math.min(a[1], b[1], c[1], d[1]);        
        bbox[2] = Math.max(a[0], b[0], c[0], d[0]) - bbox[0];
        bbox[3] = Math.max(a[1], b[1], c[1], d[1]) - bbox[1];
    }

    public moveTo(x: number, y: number) {
        this.transform.x = x;
        this.transform.y = y;
        this.setDirty();

        return this;
    }

    public move(x: number, y: number) {
        this.transform.x += x;
        this.transform.y += y;
        this.setDirty();  

        return this;
    }

    public rotateTo(r: number) {
        this.transform.rotation = r;
        this.setDirty();

        return this;
    }

    public rotate(r: number) {
        this.transform.rotation += r;
        this.setDirty();

        return this;
    }

    public scale(x: number, y: number) {
        this.transform.scaleX *= x;
        this.transform.scaleY *= y;
        this.setDirty();

        return this;
    }

    public scaleTo(x: number, y: number) {
        this.transform.scaleX = x;
        this.transform.scaleY = y;
        this.setDirty();

        return this;
    }

    public moveOrigin(x: number, y: number){
        this.transform.originX += x;
        this.transform.originY += y;
        this.setDirty();

        return this;
    }
    
    public moveOriginTo(x: number, y: number){
        this.transform.originX = x;
        this.transform.originY = y;
        this.setDirty();

        return this;
    }
}