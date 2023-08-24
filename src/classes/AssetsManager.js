export default class AssetsManager {
  constructor() {
    this.aCarregar = 0;
    this.carregadas = 0;
    this.images = {};
    this.audios = {};
    this.channels = [];
    this.MAX_CHANNELS = 20;
    for (let i = 0; i < this.MAX_CHANNELS; i++) {
      this.channels[i] = {
        audio: new Audio(),
        fim: -1
      };
    }
  }

  loadImage(key, url) {
    console.log(`Carregando imagem ${url}...`);

    this.aCarregar++;
    const imagem = new Image();
    imagem.src = url;
    this.images[key] = imagem;
    const that = this;
    imagem.addEventListener("load", function () {
      that.carregadas++;
      console.log(`Imagem ${that.carregadas}/${that.aCarregar} ${key}: ${url} carregada.`);
    });
  }

  img(key) {
    return this.images[key];
  }

  progresso() {
    if (this.aCarregar != 0) {
      return this.carregadas / this.aCarregar * 100.0;
    } else return 0.0;
  }

  loadAudio(key, url) {
    console.log(`Carregando audio ${key}: ${url}...`);
    //this.aCarregar++;
    const audio = new Audio();
    audio.src = url;
    audio.load();
    this.audios[key] = audio;
    const that = this;
    /*audio.addEventListener("canplay", function () {
        //that.carregadas++;
        console.log(`Audio ${that.carregadas}/${that.aCarregar} ${key}: ${url} carregado.`);
    });
    */
  }

  /****************************************************************************
   *               FUNÇÕES DE CONTROLE DE AUDIO AUXILIARES:                   *
   ****************************************************************************/

  play(key) {
    if (!this.audios[key]) {
      throw new Error(`Chave de audio inválida: ${key}!`);
    }
    for (let i = 0; i < this.MAX_CHANNELS; i++) {
      let agora = new Date();
      if (this.channels[i].fim < agora.getTime()) {
        this.channels[i].audio.src = this.audios[key].src;
        this.channels[i].fim = agora.getTime() + this.audios[key].duration * 1000;
        this.channels[i].audio.play();
        break;
      }

    }
  }

  pause(key) {
    for (let i = 0; i < this.channels.length; i++) {
      const canal = this.channels[i];
      if (canal.audio.src == this.audios[key].src) {
        canal.audio.pause();
        //console.log("Pausou: "+ canal.audio.currentTime);
        break;
      }
    }
  };

  resume(key) {
    for (let i = 0; i < this.channels.length; i++) {
      const canal = this.channels[i];
      if (canal.audio.src == this.audios[key].src) {
        canal.audio.play();
        //console.log("Voltou: "+ canal.audio.currentTime);
        break;
      }
    }
  };

  isPaused(key) {         //retorna se o audio está pausado
    for (let i = 0; i < this.channels.length; i++) {
      const canal = this.channels[i];
      if (canal.audio.src == this.audios[key].src) {
        if (canal.audio.paused) {
          return true;
        }
        return false;
      }
    }
    return true;                                            //Audio não foi iniciado
  };

  stop(key) {            //parar de executar o áudio removendo do canal
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].audio.src == this.audios[key].src) {
        this.channels[i].audio.pause();
        this.channels[i] = {
          audio: new Audio(),
          fim: -1
        };
        break;
      }
    }
    return true;                                          //Audio não foi iniciado
  };

  isEnded(key) {       //Se o audio terminou de ser executado
    for (let i = 0; i < this.channels.length; i++) {
      const canal = this.channels[i];
      if (canal.audio.src == this.audios[key].src) {
        if (canal.audio.ended) {
          return true;
        }
        return false;
      }
    }
    return true;                                            //Audio não foi iniciado
  };

  isPlaying(key) {
    if (this.currentTime(key) > 0 && this.currentTime(key) < this.duration(key)) {
      return true;
    }
    return false;
  }

  duration(key) {         //Tempo de duração do audio
    return this.audios[key].duration;
  };

  currentTime(key) {      //tempo até onde o audio foi executado
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].audio.src == this.audios[key].src) {
        return this.channels[i].audio.currentTime;
      }
    }
  };


  /****************************************************************************
   *                      FUNÇÕES DE DESENHO AUXILIARES:                      *
   ****************************************************************************/

  /**
   *  Desenha a imagem toda em seu tamanho padrão
   * 
   *  ctx, key, x, y
   */

  draw(params = {}) {
    params.ctx.drawImage(this.images[params.key], params.x, params.y);
  };

  /**
   *  Desenha a imagem toda com um altura e largura definidos
   * 
   *  ctx, key, x, y, w, h
   */

  drawSize(params = {}) {
    params.ctx.drawImage(this.images[params.key], params.x, params.y, params.w, params.h);
  };

  /**
   *  Desenha a imagem toda com uma angulação determinada
   * 
   *  ctx, key, x, y, ang
   */

  drawAngle(params = {}) {
    params.ctx.save();
    params.ctx.translate(params.x, params.y);
    params.ctx.rotate(params.ang * Math.PI / 180);
    params.ctx.drawImage(this.images[params.key], -this.images[params.key].width / 2, -this.images[params.key].height / 2);
    params.ctx.restore();
  }

  /**
   *  Desenha uma parte da imagem mantendo a mesma proporção na tela
   * 
   *  ctx, key, sx, sy, w, h, dx, dy
   */

  drawClip(params = {}) {
    params.ctx.drawImage(this.images[params.key], params.sx, params.sy, params.w, params.h, params.dx, params.dy, params.w, params.h);
  }

  /**
   *  Desenha parte da imagem e define a largura e altura que será desenhados na tela
   * 
   *  ctx, key, sx, sy, w, h, dx, dy, dw, dh
   */

  drawClipSize(params = {}) {
    //sx, sy, w, h dentro da imagem - w e h são para a parte da imagem que irá pegar
    //dx, dy, dw, dh onde irá desenhar e em que proporção

    params.ctx.drawImage(this.images[params.key], params.sx, params.sy, params.w, params.h, params.dx, params.dy, params.dw, params.dh);
  }

  /**
   *  Desenha parte da imagem e uma angulação é atribuida
   * 
   *  ctx, key, sx, sy, w, h, dx, dy, ang
   */

  drawClipAngle(params = {}) {
    params.ctx.save();
    params.ctx.translate(params.dx, params.dy);
    cparams.tx.rotate(params.ang * Math.PI / 180);
    params.ctx.drawImage(this.images[params.key], params.sx, params.sy, params.w,
      params.h, -params.w / 2, -params.h / 2, params.w, params.h);
    params.ctx.restore();
  }

  /**
   *  Desenha parte da imagem, com altura, largura e angulação definidos
   *  ctx, key, sx, sy, w, h, dx, dy, dw, dh, ang
   */

  drawClipSizeAngle(params = {}) {
    params.ctx.save();
    params.ctx.translate(params.dx, params.dy);
    params.ctx.rotate(params.ang * Math.PI / 180);
    params.ctx.drawImage(this.images[params.key], params.sx, params.sy, params.w, params.h,
      -params.w / 2, -params.h / 2, params.dw, params.dh);
    params.ctx.restore();
  }
}