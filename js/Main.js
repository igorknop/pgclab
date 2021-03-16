import AssetManager from "./AssetManager.js";
import Cena from "./Cena.js";
import Mapa from "./Mapa.js";
import Mixer from "./Mixer.js";
import Sprite from "./Sprite.js";
import modeloMapa1 from "../maps/mapa1.js";
import modeloMapa2 from "../maps/mapa2.js";
import InputManager from "./InputManager.js";
//console.log("Hello World!");

const input = new InputManager();
const mixer = new Mixer(10);
const assets = new AssetManager(mixer);

assets.carregaImagem("garota", "assets/garota.png");
assets.carregaImagem("esqueleto", "assets/skelly.png");
assets.carregaImagem("orc", "assets/orc.png");
assets.carregaImagem("parede", "assets/parede.png");
assets.carregaImagem("grama", "assets/grama.png");
assets.carregaAudio("moeda", "assets/coin.wav");
assets.carregaAudio("boom", "assets/boom.wav");
assets.carregaAudio("bruh", "assets/bruh.mp3");

const canvas = document.querySelector("canvas");
canvas.width = 14*32;
canvas.height = 10*32;

input.configurarTeclado({
    "ArrowLeft": "MOVE_ESQUERDA",
    "ArrowRight": "MOVE_DIREITA",
    "ArrowUp": "MOVE_CIMA",
    "ArrowDown": "MOVE_BAIXO",
});

const cena1 = new Cena(canvas, assets);

const mapa1 = new Mapa(10, 14, 32);
mapa1.carregaMapa(modeloMapa1);
cena1.configuraMapa(mapa1);

/*const mapa2 = new Mapa(10, 14, 32, cena1);
mapa2.carregaMapa(modeloMapa2);
cena1.configuraMapa(mapa2);*/

const pc = new Sprite({x:50, y :150, h: 20, w:20});
pc.controlar = function(dt){
    if(input.comandos.get("MOVE_ESQUERDA")){
        this.vx = -50;
    } else if (input.comandos.get("MOVE_DIREITA")){
        this.vx = +50;
    } else {
        this.vx = 0;
    }
    if(input.comandos.get("MOVE_CIMA")){
        this.vy = -50;
    } else if (input.comandos.get("MOVE_BAIXO")){
        this.vy = +50;
    } else {
        this.vy = 0;
    }
};
cena1.adicionar(pc);

function perseguePC(dt){
    this.vx = 25*Math.sign(pc.x - this.x);
    this.vy = 25*Math.sign(pc.y - this.y);
}

const en1 = new Sprite({x:360, color:"red", h: 20, w:20, controlar: perseguePC});

cena1.adicionar(en1);
cena1.adicionar(new Sprite({x: 115, y:70, vy:10, color:"red", h: 20, w:20, controlar: perseguePC}));
cena1.adicionar(new Sprite({x: 115, y:160, vy:-10, color:"red", h: 20, w:20, controlar: perseguePC}));

// Adiciona sprites mais fortes ("Protagonistas")
/*cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"yellow", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"#BA55D3", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"white", vida: 1000}));
cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43), w:20, h:20,
                            vy: randValue(-200, 200), vx: randValue(-200,200), color:"#00FFFF", vida: 1000}));

// Adiciona sprites "inimigos" a cada 4000 ms (4 segundos)
setInterval(() => {
    cena1.adicionar(new Sprite({x: randValue(43, canvas.width - 43), y: randValue(43, canvas.height - 43),
                                vy: randValue(-100, 100), vx: randValue(-100,100), color:"red"}));
}, 4000);
*/

cena1.iniciar();

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "s":
            cena1.iniciar(); 
            break;
        case "S":
            cena1.parar(); 
            break;
        case "c":
            assets.play("moeda"); 
            break;
        case "b":
            assets.play("boom"); 
            break;
    }
})

function randValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
