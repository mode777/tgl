import { Frame } from '@tgl/2d';
import { vec2 } from '@tgl/core';

/**
 * Represents a binary tree, that will try to pack rectangles.
 */
export class TreeNode {

    private left: TreeNode;
    private right: TreeNode;
    private full = false;

    constructor(private frame: Frame){

    }

    /**
     * Insert a rectangle into this node
     * @param item A size in the format `[x,y]`
     * @returns The rectangle of the inserted element
     */
    public insert(item: vec2<number>): Frame {
        if(this.hasChildren)
            return this.left.insert(item) || this.right.insert(item);
        else {
            if(this.full)
                return null;
            
            const dw = this.frame[2] - item[0];
            const dh = this.frame[3] - item[1];

            // no fit
            if(dw < 0 || dh < 0)
                return null;

            // prefect fit
            if(dw === 0 && dh === 0){
                this.full = true;
                return this.rect;
            }

            // split horizontal
            if(dw > dh){
                this.left = new TreeNode([this.frame[0], this.frame[1], item[0], this.frame[3]])
                this.right = new TreeNode([this.frame[0] + item[0], this.frame[1], dw, this.frame[3]])
            }
            // split vertical
            else {
                this.left = new TreeNode([this.frame[0], this.frame[1], this.frame[2], item[1]])
                this.right = new TreeNode([this.frame[0], this.frame[1] + item[1], this.frame[2], dh])                
            }

            return this.left.insert(item);
        }
    } 

    /** Get bounding box of Til */
    public get rect() : Frame {
        return [
            this.frame[0],
            this.frame[1],
            this.frame[2],
            this.frame[3]
        ]
    }

    /** True if this node is not a leaf */
    public get hasChildren(){
        return this.left && this.right;
    }

}
    