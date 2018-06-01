import { TglContext, GlClearFlags, Texture } from '@tgl/core'
import { SpriteBatch, ISprite } from '@tgl/2d';

async function main(){    
    // use of TglContext is completely optional
    const context = new TglContext({
        width: 512,
        height: 512
    })
    document.body.appendChild(context.canvas);
    
    // get the WebGLRenderingContext 
    const gl = context.webGlRenderingContext;

    const particleSystem = new SpriteBatch(gl, {
        size: 1024,
        texture: await Texture.fromFile(gl, '../assets/particle.png'),
        //sprites: [{ index: 0 }]
    });

    const origin = [256, 480];

    const sprites: Particle[] = Array.from({length: particleSystem.size}, (_,i) => {
        
        const scale = Math.random() * 1.1 * 0.9;

        return {
            sprite: particleSystem.createSprite({ 
                index: i,            
            })
            .center()
            .scaleTo(scale, scale)
            .moveTo(origin[0], origin[1]),
            vx: Math.random() * 1 - .5,
            vy: (Math.random() * -4) - 1,
            lifetime: Math.random() * 100 + 60
        };
    });


    function updateParticle(particle: Particle){
        if(particle.lifetime > 0){
            particle.sprite.move(particle.vx, particle.vy);
            //particle.vy += .002;
            particle.lifetime--;
        }
        else {
            particle.sprite.moveTo(origin[0], origin[1]);
            particle.lifetime = Math.random() * 600 + 60;
        }
    }

    function draw(){
        // clear the screen black
        context.state.clearColor([0, 0, 0, 1]);
        context.clear(GlClearFlags.COLOR_BUFFER_BIT);

        context.setAdditiveBlending();
        sprites.forEach(updateParticle)
        particleSystem.update();
        particleSystem.draw();

        requestAnimationFrame(draw);
    }
    
    requestAnimationFrame(draw);    
}

main();

interface Particle {
    sprite: ISprite,
    vx: number,
    vy: number,
    lifetime: number
}
