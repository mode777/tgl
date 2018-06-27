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

export enum FlipFlags {
    None                = 0x00000000,
    FlippedHorizontally = 0x80000000,
    FlippedVertically   = 0x40000000,
    FlippedDiagonally   = 0x20000000
}