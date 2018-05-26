export type Frame = [number, number, number, number];

export interface ISprite {
    boundingBox : Frame;
    center(x?: boolean, y?: boolean): ISprite; 
    moveTo(x: number, y: number): ISprite;
    move(x: number, y: number): ISprite;
    rotateTo(r: number): ISprite;
    rotate(r: number): ISprite;
    scale(x: number, y: number): ISprite;
    scaleTo(x: number, y: number): ISprite;
    moveOrigin(x: number, y: number): ISprite;
    moveOriginTo(x: number, y: number): ISprite;
}