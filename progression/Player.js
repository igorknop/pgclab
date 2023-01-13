import Sprite from "./Sprite.js";
import { setDebugMode, getDebugMode } from "../classes/DebugMode.js";

let _player = null;

export function setPlayer(newPlayer) {
  _player = newPlayer;
}

export function getPlayer() {
  return _player;
}

export default class Player extends Sprite {
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  // Sprite.call(this, {s: params.s, w: 16, h: 16,
  //   hitBox: {
  //     x: 0,
  //     y: 0,
  //     w: 16,
  //     h: 16,
  //     wDefault: 16,
  //     hDefault: 16
  //   }
  // });

  // let exemplo = {
  //   timeWalkSound: 0.5,
  //   levelNumber: 1,
  //   vidas: 3,
  //   vivo: true,
  //   room: -1,
  //   tesourosColetados: 0,
  //   playerVel: 180, // 100
  //   hp: 500,
  //   maxHp: 500,
  //   hitpoint: 50,
  //   cooldownTeleporte: 1,
  //   cooldownAtaque: 1,                  //Tempo do personagem travado até terminar o ataque
  //   cooldownImune: 0,
  //   imune: false,

  //   // Mapa das teclas pressionadas
  //   teclas: {
  //     up: false,
  //     down: false,
  //     right: false,
  //     left: false,
  //     ctrl: false,
  //     shift: false,
  //     space: false
  //   },

  //   // Ataque
  //   tiro: [],

  //   // AnimationStates
  //   sentidoMovimento: 0,          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
  //   atacando: 0,                  //0 => Não, 1 => Sim
  //   animation: [],
  //   nomeImagem: "player"
  // }

  // Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe

  // this.criarAnimacoes();

  // Heranca
  // Player.prototype = new Sprite();              // Define que o Player é um Sprite
  // constructor = Player;

  restart() {
    this.vivo = true;
    this.tesourosColetados = 0;
    this.cooldownImune = 0;
    this.imune = false;
    this.hp = 500;
    this.setRoom();
  }

  setRoom() {
    this.room = this.map.cell[this.gy][this.gx].room;
  }

  moverCompleto(dt) {
    this.cooldownTeleporte = this.cooldownTeleporte - dt; // Cooldown de teleporte pra não teleportar direto
    this.cooldownImune = this.cooldownImune - dt;
    this.tratarAnimacao();
    if (this.cooldownAtaque < 0) {
      this.controlePorTeclas();
      this.mover(dt);
    }
    this.moverTiros(dt);
    this.animationController(dt);
    this.removerTiros();
    if (this.hp <= 0) {
      this.vivo = false;
    }
  }

  ativarInvencibilidade() {
    this.cooldownImune = 1.2;
    this.imune = true;
  }

  moverTiros(dt) {
    for (let i = 0; i < this.tiro.length; i++) {
      // Movimentação
      this.tiro[i].x = this.tiro[i].x + this.tiro[i].vx * dt;
      this.tiro[i].y = this.tiro[i].y + this.tiro[i].vy * dt;

      // Tempo de vida
      this.tiro[i].cooldown = this.tiro[i].cooldown - dt;
    }
  }

  removerTiros() {
    for (let i = 0; i < this.tiro.length; i++) {
      if (this.tiro[i].cooldown < 0) {
        this.tiro.splice(i, 1);
      }
    }
  }

  criarAnimacoes() {
    /******************************************************************************
     * Animation: (tipos de animação)                                             *
     * [animacao de caminhar, animação atacar]                                    *
     *                                                                            *
     * elemento dentro do animation: (AnimationPosition)                          *
     * [vetor com 4 posicoes de sentidos de movimento]                            *
     *                                                                            *
     * elemento dentro do AnimationPosition: (AnimationFrame)                     *
     * [cada frame da animação correspondente]                                    *
     *                                                                            *
     ******************************************************************************/
    let typeNames = ["Walk", "Atack"];

    // Cria a lista de tipos de animações
    for (let i = 0; i < typeNames.length; i++) {
      let auxAnimation = {
        animationPosition: [],
        type: typeNames[i],
        qtdPositions: 4,
      };
      if (i === 0) {
        for (let j = 0; j < 4; j++) {
          //  4 Direções
          let auxAnimationPosition = {
            animationFrame: [],
            speedAnimation: 10, //160
            qtdAnimacoes: 9,
            sw: 64,
            sh: 64,
            sxBegin: 0,
            syBegin: (8 + j) * 64,
          };
          auxAnimation.animationPosition.push(auxAnimationPosition);
        }
      } else {
        for (let j = 0; j < 4; j++) {
          //  4 Direções
          let auxAnimationPosition = {
            animationFrame: [],
            speedAnimation: 10,
            qtdAnimacoes: 6,
            sw: 64,
            sh: 64,
            sxBegin: 0,
            syBegin: (12 + j) * 64,
          };
          auxAnimation.animationPosition.push(auxAnimationPosition);
        }
      }
      this.animation.push(auxAnimation);
    }

    for (let i = 0; i < this.animation.length; i++) {
      //Walk, Atack
      let auxAnimation = this.animation[i].animationPosition;
      for (let j = 0; j < auxAnimation.length; j++) {
        //4 posições
        let posicao = auxAnimation[j];
        for (let k = 0; k < posicao.qtdAnimacoes; k++) {
          //Monta o vetor de frames de animação
          let auxAnimationFrame = {
            sx: posicao.sxBegin + posicao.sw * k,
            sy: posicao.syBegin,
            sw: posicao.sw,
            sh: posicao.sh,
          };
          posicao.animationFrame.push(auxAnimationFrame);
        }
      }
    }
  }

  controlePorTeclas() {
    // Teclas direcionais
    if (this.teclas.up) {
      this.vy = -this.playerVel;
      this.sentidoMovimento = 0;
    }
    if (this.teclas.right) {
      this.vx = this.playerVel;
      this.sentidoMovimento = 3;
    }
    if (this.teclas.down) {
      this.vy = this.playerVel;
      this.sentidoMovimento = 2;
    }
    if (this.teclas.left) {
      this.vx = -this.playerVel;
      this.sentidoMovimento = 1;
    }

    // Teclas com ações a mais
    if (this.teclas.ctrl) {
      this.atacando = 1;
      this.cooldownAtaque = 1;
      let projetil = new Sprite({
        x: this.hitBox.x,
        y: this.hitBox.y,
        w: this.hitBox.w,
        h: this.hitBox.h,
        cooldown: 0.5,
      });
      this.tiro.push(projetil);
      switch (this.sentidoMovimento) {
        case 0:
          projetil.vy = -5;
          break;
        case 1:
          projetil.vx = -5;
          break;
        case 2:
          projetil.vy = 5;
          break;
        case 3:
          projetil.vx = 5;
          break;
      }
    } //else{ this.atacando = 0;}
    if (this.teclas.shift) {
      this.playerVel = 250;
    } else {
      this.playerVel = 180;
    }

    // Condição de parada
    if (this.teclas.right === this.teclas.left) {
      this.vx = 0;
    }
    if (this.teclas.up === this.teclas.down) {
      this.vy = 0;
    }
  }

  tratarAnimacao() {
    this.hitBox.h = this.hitBox.hDefault;
    switch (
      this.sentidoMovimento //Movimento
    ) {
      case 0: //Cima
        this.hitBox.x = this.x;
        this.hitBox.y = this.y - this.h / 2;
        this.hitBox.h = this.hitBox.wDefault;

        break;
      case 1: //Esquerda
        this.hitBox.x = this.x - this.w / 2;
        this.hitBox.y = this.y;
        break;
      case 2: //Baixo
        this.hitBox.x = this.x;
        this.hitBox.y = this.y + this.h / 2;
        break;
      case 3: //Direita
        this.hitBox.x = this.x + this.w / 2;
        this.hitBox.y = this.y;
        break;
      default:
        break;
    }
    this.speedAnimation =
      this.animation[this.atacando].animationPosition[
        this.sentidoMovimento
      ].speedAnimation;
  }

  animationController(dt) {
    this.pose = this.pose + this.speedAnimation * dt;
    if (this.atacando === 0) {
      if (this.vx === 0 && this.vy === 0) {
        // Personagem parado a pose se mantem
        this.pose = 0;
      }
    }

    if (this.cooldownAtaque < 0) {
      this.atacando = 0;
    } else {
      // Retorna pra animação inicial se o ataque já tiver concluido o ciclo
      if (
        this.pose >
        this.animation[this.atacando].animationPosition[this.sentidoMovimento]
          .qtdAnimacoes
      ) {
        this.pose = 0;
      }
    }

    this.cooldownAtaque = this.cooldownAtaque - 2 * dt;
  }

  desenhar(ctx) {
    let auxAnimation =
      this.animation[this.atacando].animationPosition[this.sentidoMovimento]; // Dados da animação do personagem
    // tipo de animação -- sentido de movimento -- vetor de frames de animação

    let elipse = {
      x: -auxAnimation.sw / 8 + 8,
      y: -auxAnimation.sh / 16 + 3,
      radiusX: auxAnimation.sw / 4 - 2,
      radiusY: auxAnimation.sh / 8 - 2,
      rotation: 0,
      startAngle: 0,
      endAngle: 2 * Math.PI,
      anticlockwise: false,
    };
    ctx.linewidth = 1;
    ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
    ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(
      elipse.x,
      elipse.y,
      elipse.radiusX,
      elipse.radiusY,
      elipse.rotation,
      elipse.startAngle,
      elipse.endAngle,
      elipse.anticlockwise
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (this.cooldownImune > 0) {
      ctx.globalAlpha = 0.4;
      this.imune = true;
    } else {
      this.imune = false;
    }
    assetsMng.drawClipSize({
      ctx: ctx,
      key: this.nomeImagem,
      sx: auxAnimation.animationFrame[
        Math.floor(this.pose) % auxAnimation.qtdAnimacoes
      ].sx,
      sy: auxAnimation.animationFrame[
        Math.floor(this.pose) % auxAnimation.qtdAnimacoes
      ].sy,
      w: auxAnimation.animationFrame[
        Math.floor(this.pose) % auxAnimation.qtdAnimacoes
      ].sw,
      h: auxAnimation.animationFrame[
        Math.floor(this.pose) % auxAnimation.qtdAnimacoes
      ].sh,
      dx: -auxAnimation.sw / 2,
      dy: 5 - auxAnimation.sh,
      dw: auxAnimation.sw,
      dh: auxAnimation.sh,
    });
    ctx.restore();
    if (getDebugMode() == 3) {
      this.desenharCell(ctx); //Debug mode Grid
      this.desenharCentro(ctx);
      this.desenharCentroHitBox(ctx);
    } else if (getDebugMode() == 4) {
      this.desenharCell(ctx); //Debug mode Grid
      this.desenharHurtBox(ctx);
      this.desenharCentro(ctx);
      this.desenharHitBox(ctx);
      this.desenharCentroHitBox(ctx);

      // TESTE === DESENHA OS TIROS DE ATAQUE
      for (let i = 0; i < this.tiro.length; i++) {
        ctx.fillStyle = "gold";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(this.tiro[i].x, this.tiro[i].y);
        ctx.fillRect(
          -this.tiro[i].w / 2,
          -this.tiro[i].h / 2,
          this.tiro[i].w,
          this.tiro[i].h
        );
        ctx.strokeRect(
          -this.tiro[i].w / 2,
          -this.tiro[i].h / 2,
          this.tiro[i].w,
          this.tiro[i].h
        );
        ctx.restore();
      }
    }
  }

  // caixaColisap = HurtBox
  desenharHurtBox(ctx) {
    // hurt box => danifica o personagem
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }

  desenharHitBox(ctx) {
    if (this.atacando) {
      // hurt box => danifica o personagem
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.save();
      ctx.translate(this.hitBox.x, this.hitBox.y);
      ctx.fillRect(
        -this.hitBox.w / 2,
        -this.hitBox.h / 2,
        this.hitBox.w,
        this.hitBox.h
      );
      ctx.strokeRect(
        -this.hitBox.w / 2,
        -this.hitBox.h / 2,
        this.hitBox.w,
        this.hitBox.h
      );
      ctx.restore();
    }
  }
  /**
   * Mover que usa WIDTH e HEIGHT como referência no movimento
   */
  mover(dt) {
    this.gx = Math.floor(this.x / this.map.s);
    this.gy = Math.floor(this.y / this.map.s);

    if (getDebugMode() === 0 || getDebugMode() === 4) {
      if (this.gx === 0 || this.gx === this.map.w - 1) {
        // Trata casos extremos do mapa =>{gx <= 0, gx >= gxMapa}
        if (this.gx === 0) {
          if (this.vx < 0) {
            let limite = this.gx * this.map.s;
            let maxDx = limite - (this.x - this.w / 2);
            let Dx = this.vx * dt;
            this.x += Math.max(Dx, maxDx);
          } else if (
            this.vx > 0 &&
            this.map.cell[this.gy][this.gx + 1].tipo === 1
          ) {
            let limite = (this.gx + 1) * this.map.s;
            let maxDx = limite - (this.x + this.w / 2);
            let Dx = this.vx * dt;
            this.x += Math.min(Dx, maxDx);
          } else {
            this.x += this.vx * dt;
          }
        } else {
          if (this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1) {
            let limite = this.gx * this.map.s;
            let maxDx = limite - (this.x - this.w / 2);
            let Dx = this.vx * dt;
            this.x += Math.max(Dx, maxDx);
          } else if (this.vx > 0) {
            let limite = (this.gx + 1) * this.map.s;
            let maxDx = limite - (this.x + this.w / 2);
            let Dx = this.vx * dt;
            this.x += Math.min(Dx, maxDx);
          } else {
            this.x += this.vx * dt;
          }
        }
      } else {
        if (this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1) {
          let limite = this.gx * this.map.s;
          let maxDx = limite - (this.x - this.w / 2);
          let Dx = this.vx * dt;
          this.x += Math.max(Dx, maxDx);
        } else if (
          this.vx > 0 &&
          this.map.cell[this.gy][this.gx + 1].tipo === 1
        ) {
          let limite = (this.gx + 1) * this.map.s;
          let maxDx = limite - (this.x + this.w / 2);
          let Dx = this.vx * dt;
          this.x += Math.min(Dx, maxDx);
        } else {
          this.x += this.vx * dt;
        }
      }

      if (this.gy === 0 || this.gy === this.map.h - 1) {
        // Trata casos extremos do mapa =>{gy <= 0, gy >= gyMapa}
        if (this.gy === 0) {
          if (this.vy < 0) {
            let limite = this.gy * this.map.s;
            let maxDy = limite - (this.y - this.h / 2);
            let Dy = this.vy * dt;
            this.y += Math.max(Dy, maxDy);
          } else if (
            this.vy > 0 &&
            this.map.cell[this.gy + 1][this.gx].tipo !== 0
          ) {
            let limite = (this.gy + 1) * this.map.s;
            let maxDy = limite - (this.y + this.h / 2);
            let Dy = this.vy * dt;
            this.y += Math.min(Dy, maxDy);
          } else {
            this.y += this.vy * dt;
          }
        } else {
          if (this.vy < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0) {
            let limite = this.gy * this.map.s;
            let maxDy = limite - (this.y - this.h / 2);
            let Dy = this.vy * dt;
            this.y += Math.max(Dy, maxDy);
          } else if (this.vy > 0) {
            let limite = (this.gy + 1) * this.map.s;
            let maxDy = limite - (this.y + this.h / 2);
            let Dy = this.vy * dt;
            this.y += Math.min(Dy, maxDy);
          } else {
            this.y += this.vy * dt;
          }
        }
      } else {
        if (this.vy < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0) {
          let limite = this.gy * this.map.s;
          let maxDy = limite - (this.y - this.h / 2);
          let Dy = this.vy * dt;
          this.y += Math.max(Dy, maxDy);
        } else if (
          this.vy > 0 &&
          this.map.cell[this.gy + 1][this.gx].tipo !== 0
        ) {
          let limite = (this.gy + 1) * this.map.s;
          let maxDy = limite - (this.y + this.h / 2);
          let Dy = this.vy * dt;
          this.y += Math.min(Dy, maxDy);
        } else {
          this.y += this.vy * dt;
        }
      }
    } else {
      // Debug mode => Colision is not detected
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }
  }

  atacarModoPlayer(alvo) {
    if (this.atacar(alvo)) {
      for (let i = 0; i < this.tiro.length; i++) {
        if (this.tiro[i].colidiuCom3(alvo)) {
          if (!alvo.imune) {
            alvo.hp = alvo.hp - this.hitpoint;
            alvo.ativarInvencibilidade();
          }
          /*
        let taxaRecuo = 15;
        // Recuo do inimigo
        switch (this.sentidoMovimento) {  //Movimento
          case 0:     //Cima
            alvo.y = alvo.y - taxaRecuo; 
            break;
          case 1:     //Esquerda
            alvo.x = alvo.x - taxaRecuo;
            break;
          case 2:     //Baixo
            alvo.y = alvo.y + taxaRecuo;
            break;
          case 3:    //Direita 
            alvo.x = alvo.x + taxaRecuo;
            break;
          default:
            break;
          }
        */
          this.tiro[i].cooldown = -1; // Para ser removido
        }
      }
    }
  }

  getRoom() {
    return this.map.cell[this.gy][this.gx].room;
  }

  setTeclas(key, value) {
    this.teclas[key] = value;
  }
}
