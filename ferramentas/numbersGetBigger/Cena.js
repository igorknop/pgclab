import getXY from "../../js/utils/getXY.js";

export default class Cena {
  // Esta classe é responsável por desenhar elementos na tela em uma animação

  constructor(canvas = null, assets = null) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d");
    this.assets = assets;
    this.game = null;
    this.heuristica = null;
    this.counter = 0;
    this.temporizador = 0;
    this.sprites = [];
    this.aRemover = [];
    this.t0 = null;
    this.dt = 0;
    this.idAnim = null;
    this.mapa = null;
    this.layer = null;
    this.path = null;
    this.rodando = true;
    this.botoes = [];
  }

  desenhar() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.mapa?.desenhar(this.ctx);
    this.layer?.desenhar(this.ctx);
    this.path?.desenhar(this.ctx);
    this.desenharHud();
    this.desenharBotoes();

    //this.ctx.fillStyle = "black";
    //this.ctx.fillRect(17*48 - 72, 554, 10, 10);
  }

  adicionar(sprite) {
    sprite.cena = this;
    this.sprites.push(sprite);
  }

  passo(dt) {
    if (this.assets.acabou()) {
      for (const sprite of this.sprites) {
        sprite.passo(dt);
      }
    }
  }

  quadro(t) {
    this.t0 = this.t0 ?? t;
    this.dt = this.rodando ? (t - this.t0) / 1000 : 0;

    this.passo(this.dt);
    this.desenhar();
    // this.checaColisao();
    // this.removerSprites();

    if (this.rodando) {
      this.iniciar();
    }
    this.t0 = t;
  }

  iniciar() {
    this.rodando = true;
    this.idAnim = requestAnimationFrame((t) => {
      this.quadro(t);
    });
  }

  parar() {
    this.rodando = false;
    cancelAnimationFrame(this.idAnim);
    this.t0 = null;
    this.dt = 0;
  }

  checaColisao() {
    for (let a = 0; a < this.sprites.length - 1; a++) {
      const spriteA = this.sprites[a];
      for (let b = a + 1; b < this.sprites.length; b++) {
        const spriteB = this.sprites[b];
        if (spriteA.colidiuCom(spriteB)) {
          this.quandoColidir(spriteA, spriteB);
        }
      }
    }
  }

  quandoColidir(a, b) { }

  removerSprites() {
    for (const alvo of this.aRemover) {
      const idx = this.sprites.indexOf(alvo);
      if (idx >= 0) {
        this.sprites.splice(idx, 1);
      }
    }
    this.aRemover = [];
  }

  configuraMapa(mapa) {
    this.mapa = mapa;
    this.mapa.cena = this;
  }

  configuraLayer(layer) {
    this.layer = layer;
    this.layer.cena = this;
  }

  configuraPath(path) {
    this.path = path;
    this.path.cena = this;
  }

  preparar() {
    this.sprites = [];
    this.aRemover = [];
    this.t0 = null;
    this.dt = 0;
    this.idAnim = null;
    this.mapa = null;
    this.layer = null;
    this.path = null;
    this.rodando = true;
    this.botoes = [];
  }

  mousedown(e) {
  }
  click(e) {
    this.mousedown(e);
  }

  desenharHud() { }

  setHeuristica(heuristica) {
    this.heuristica = heuristica;

  }

  mousemove(e) {
    const [x, y] = getXY(e, this.canvas);
    for (let i = 0; i < this.botoes.length; i++) {
      const botao = this.botoes[i];
      if (!botao.esconder && botao.hasPoint({ x, y })) {
        this.canvas.style.cursor = 'pointer'
        return;
      }
    }
    this.canvas.style.cursor = 'default'
  }

  adicionarBotao(botao) {
    this.botoes.push(botao);
    return botao;
  }

  desenharBotoes() {
    this.botoes.forEach(botao => {
      botao.desenhar(this.ctx, this.assets);
    });
  }

  pausarJogo() {
    this.rodando = !this.rodando
  }
}
