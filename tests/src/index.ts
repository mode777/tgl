import { GlContext, GlClearFlags, ArrayBuffer, Texture } from '@tgl/core';


console.time('comp');
const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
const context = new GlContext(canvas);
const gl = context.handle;

context.clear(GlClearFlags.COLOR_BUFFER_BIT, 1);

const buffer = new Uint8Array(canvas.width*canvas.height*4);
gl.readPixels(0,0,canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);

const img = new Image();
img.src = './assets/ref.png';
img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    const pixelData = canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;

    let ctr = 0;
    for (let i = 0; i < pixelData.length; i++) {
        if(buffer[i] === pixelData[i])
            ctr++;     
    }
    console.log((ctr / pixelData.length)*100 + '%')
    console.timeEnd('comp');
}

// const buffer = new ArrayBuffer(gl, {
//     data: [ 
//         -1,1,0.5, 1,-1,0.5, -1,-1,0.5
//      ],
//      attribute: "coord"
// });

// const texture = new Texture(gl, {
//     source: "assets/my_texture"
// })