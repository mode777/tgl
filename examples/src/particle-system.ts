import { TglContext, GlClearFlags, Texture, BlendMode } from '@tgl/core'
import { SpriteBatch, ISprite, Sprite } from '@tgl/2d';

async function main(){    

    const context = new TglContext({
        width: 512,
        height: 512,
        //antialias: true
    })
    document.body.appendChild(context.canvas);
    
    // get the WebGLRenderingContext 
    const gl = context.webGlRenderingContext;

    const particleSystem = new SpriteBatch(gl, {
        size: 512,
        texture: await Texture.fromFile(gl, '../assets/particle.png'),
        //sprites: [{ index: 0 }]
    });

    const origin = [256, 480];
    const speed = 1;

    const sprites: Particle[] = Array.from({length: particleSystem.size}, (_,i) => {
        
        const scale = Math.random() * 1.1 * 0.9;

        return {
            sprite: particleSystem.createSprite({ 
                index: i,            
            })
            .center()
            .scaleTo(scale, scale)
            .moveTo(origin[0], origin[1]),
            vx: Math.random() * speed - speed/2,
            vy: (Math.random() * -speed * 4) - speed,
            lifetime: Math.random() * 100 + 60
        };
    });


    function updateParticle(particle: Particle){
        if(particle.lifetime > 0){
            particle.sprite.move(particle.vx, particle.vy);
            const scale = particle.lifetime / 100;
            particle.sprite.scaleTo(scale, scale);
            //particle.vy += .002;
            particle.lifetime--;
        }
        else {
            particle.sprite.moveTo(origin[0], origin[1]);
            particle.lifetime = Math.random() * 100 + 60;
        }
    }

    function draw(){
        // clear the screen black
        context.clear(GlClearFlags.COLOR_BUFFER_BIT, [0,0,0,1]);

        context.setBlendMode(BlendMode.Add)
        
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
