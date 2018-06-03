import { TreeNode } from "./texture-atlas/TreeNode";
import { Frame } from '@tgl/2d';

const upload = document.createElement('input');
document.body.appendChild(upload);
upload.type = 'file';
upload.multiple = true;
upload.onchange = (ev) => {
    const files: File[] = [];

    for (let i = 0; i < upload.files.length; i++) {
        files.push(upload.files[i]);        
    }

    main(files);
}

async function main(files: File[]){
    const imagePromises = files.map(f => new Promise<HTMLImageElement>((res, rej) => {
        const fr = new FileReader();
        const img = new Image();

        fr.readAsDataURL(f);
        fr.onload = _ => {
            img.src = fr.result;
            res(img);
        }
    }));
    const images = (await Promise.all(imagePromises));

    //const nextPoT = (x:number) => Math.pow(2, Math.ceil(Math.log2(x)));
    let frames: Frame[] = [];
    let width = 16;
    let height = 16;
    
    {
        let finished = false;
        let sw = 0;

        while(!finished){
            console.log(width,height);
            const root = new TreeNode([0,0,width,height]);
            frames = [];
            
            for (let i = 0; i < images.length; i++) {
                finished = false;
                const frame = root.insert([images[i].width, images[i].height]);
                if(frame !== null){
                    frames.push(frame)
                }
                else {
                    if(sw === 0){
                        width *= 2;
                        sw = 1;
                    }
                    else {
                        height *= 2;
                        sw = 0;
                    }

                    
                    break;
                }
                finished = true;
            }
        }
    }      

    
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;
    const context2d = canvas.getContext('2d', { alpha: true });

    images.forEach((img, i) => context2d.drawImage(img, frames[i][0], frames[i][1]))
}