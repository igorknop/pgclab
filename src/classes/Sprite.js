import Debugger, { DEBUG_MODE } from "./utils/Debugger.js";


export default class Sprite {

    constructor(params = { s: 16 }) {
        let exemplo = {
            //Atibutos da Fisica
            direcaoX: 0,
            direcaoY: 0,
            x: 0,
            vx: 0,
            y: 0,
            vy: 0,
            w: 0,
            h: 0,

            //Atributos de grade
            gx: 0,
            gy: 0,
            s: params.s,
            map: undefined,

            hitBox: {
                x: 0,
                y: 0,
                w: 5,
                h: 5,
            },

            //Atributos da imagem
            nomeImagem: "",
            wImagem: 0,
            hImagem: 0,
            sx: 0,
            sy: 0,
            sizeImagem: params.s,
            wImagem: params.s,
            hImagem: params.s,
            pose: 0,
            qtdAnimacoes: 0,
            animationState: 0,
            frameTimeAnimation: 12,
            speedAnimation: 160,
            typeAnimation: 0,     //0 => Walking, 1 => Atacking
        }

        Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe

        this.colorBG;
        this.colorBorder;
        this.borderSize = 1;
    };

    mover(dt) {
        this.gx = Math.floor(this.x / this.map.s);
        this.gy = Math.floor(this.y / this.map.s);
        //console.log(this.gx + " -> gx, " + this.gy + " -> gy");

        /****************************************************************
        * Outro meio de andar nesse caso é utilizando a propria grade***
        *****************************************************************/

        /*
          this.x = this.gx*this.map.s + this.s;       //Andando por grade
          this.y = this.gy*this.map.s + this.s;
        */
          if (Debugger.isDebugMode(DEBUG_MODE.DEBUG_OFF) ||
              Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
              if (this.gx === 0 || this.gx === this.map.w - 1) {
                  //Trata casos extremos do mapa =>{gx <= 0, gx >= gxMapa}
                if (this.gx === 0) {
                    if (this.vx < 0) {
                        let limite = (this.gx) * this.map.s;
                        let maxDx = limite - (this.x - this.s / 2);
                        let Dx = this.vx * dt;
                        this.x += Math.max(Dx, maxDx);
                    } else if (this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1) {
                        let limite = (this.gx + 1) * this.map.s;
                        let maxDx = limite - (this.x + this.s / 2);
                        let Dx = this.vx * dt;
                        this.x += Math.min(Dx, maxDx);
                    } else {
                        this.x += this.vx * dt;
                    }
                }
                else {
                    if (this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1) {
                        let limite = (this.gx) * this.map.s;
                        let maxDx = limite - (this.x - this.s / 2);
                        let Dx = this.vx * dt;
                        this.x += Math.max(Dx, maxDx);
                    } else if (this.vx > 0) {
                        let limite = (this.gx + 1) * this.map.s;
                        let maxDx = limite - (this.x + this.s / 2);
                        let Dx = this.vx * dt;
                        this.x += Math.min(Dx, maxDx);
                    } else {
                        this.x += this.vx * dt;
                    }
                }
            }
            else {
                if (this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1) {
                    let limite = (this.gx) * this.map.s;
                    let maxDx = limite - (this.x - this.s / 2);
                    let Dx = this.vx * dt;
                    this.x += Math.max(Dx, maxDx);
                } else if (this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1) {
                    let limite = (this.gx + 1) * this.map.s;
                    let maxDx = limite - (this.x + this.s / 2);
                    let Dx = this.vx * dt;
                    this.x += Math.min(Dx, maxDx);
                } else {
                    this.x += this.vx * dt;
                }
            }

            if (this.gy === 0 || this.gy === (this.map.h - 1))  //Trata casos extremos do mapa =>{gy <= 0, gy >= gyMapa}
            {
                if (this.gy === 0) {
                    if (this.vy < 0) {
                        let limite = (this.gy) * this.map.s;
                        let maxDy = limite - (this.y - this.s / 2);
                        let Dy = (this.vy) * dt;
                        this.y += Math.max(Dy, maxDy);
                    } else if ((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0) {
                        let limite = (this.gy + 1) * this.map.s;
                        let maxDy = limite - (this.y + this.s / 2);
                        let Dy = (this.vy) * dt;
                        this.y += Math.min(Dy, maxDy);
                    } else {
                        this.y += (this.vy) * dt;
                    }
                }
                else {
                    if ((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0) {
                        let limite = (this.gy) * this.map.s;
                        let maxDy = limite - (this.y - this.s / 2);
                        let Dy = (this.vy) * dt;
                        this.y += Math.max(Dy, maxDy);
                    } else if ((this.vy) > 0) {
                        let limite = (this.gy + 1) * this.map.s;
                        let maxDy = limite - (this.y + this.s / 2);
                        let Dy = (this.vy) * dt;
                        this.y += Math.min(Dy, maxDy);
                    } else {
                        this.y += (this.vy) * dt;
                    }
                }
            }
            else {
                if ((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0) {
                    let limite = (this.gy) * this.map.s;
                    let maxDy = limite - (this.y - this.s / 2);
                    let Dy = (this.vy) * dt;
                    this.y += Math.max(Dy, maxDy);
                } else if ((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0) {
                    let limite = (this.gy + 1) * this.map.s;
                    let maxDy = limite - (this.y + this.s / 2);
                    let Dy = (this.vy) * dt;
                    this.y += Math.min(Dy, maxDy);
                } else {
                    this.y += (this.vy) * dt;
                }
            }
        }
        else { //Debug mode => Colision is not detected
            this.x += (this.vx) * dt;
            this.y += (this.vy) * dt;
        }

        //this.animationController();
    };

    mover2(dt) {
        this.gx = Math.floor(this.x / this.map.s);
        this.gy = Math.floor(this.y / this.map.s);

        if (Debugger.isDebugMode(DEBUG_MODE.DEBUG_OFF) ||
            Debugger.isDebugMode(DEBUG_MODE.CAIXA_DE_COLISAO)) {
            this.adicionaRestricaoMovimento(dt);
        }
        else {
            this.x += (this.vx) * dt;
            this.y += (this.vy) * dt;
        }

        this.animationController();
    }

    adicionaRestricaoMovimento(dt) {
        let dnx;
        let dx;
        dx = this.vx * dt;
        dnx = dx;
        dy = this.vy * dt;
        dny = dy;
        if (dx > 0 && this.map.cell[this.gy][this.gx + 1].tipo != 0) {
            dnx = this.map.s * (this.gx + 1) - (this.x + this.w / 2);
            dx = Math.min(dnx, dx);
        }
        if (dx < 0 && this.map.cell[this.gy][this.gx - 1].tipo != 0) {
            dnx = this.map.s * (this.gx - 1 + 1) - (this.x - this.w / 2);
            dx = Math.max(dnx, dx);
        }
        if (dy > 0 && this.map.cell[this.gy + 1][this.gx].tipo != 0) {
            dny = this.map.s * (this.gy + 1) - (this.y + this.h / 2);
            dy = Math.min(dny, dy);
        }
        if (dy < 0 && this.map.cell[this.gy - 1][this.gx].tipo != 0) {
            dny = this.map.s * (this.gy - 1 + 1) - (this.y - this.h / 2);
            dy = Math.max(dny, dy);
        }
        this.vy = dy / dt;
        this.x = this.x + dx;
        this.y = this.y + dy;

        const MAXX = this.map.s * this.map.c - this.w / 2;
        const MAXY = this.map.s * this.map.l - this.h / 2;

        if (this.x > MAXX) this.x = MAXX;
        if (this.y > MAXY) {
            this.y = MAXY;
            this.vy = 0;
        }
        if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
        if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;
    }

    copy(sprite) {
        //Atibutos da Fisica
        this.x = sprite.x;
        this.vx = sprite.vx;
        this.y = sprite.y;
        this.vy = sprite.vy;
        this.w = sprite.w;
        this.h = sprite.h;

        //Atributos de grade
        this.gx = sprite.gx;
        this.gy = sprite.gy;
        this.s = sprite.s;
        this.map = sprite.map;

        //Atributos da imagem
        this.wImagem = sprite.wImagem;
        this.hImagem = sprite.hImagem;
        this.sx = sprite.sx;
        this.sy = sprite.sy;

        this.colorBG = sprite.colorBG;
        this.colorBorder = sprite.colorBorder;
        this.borderSize = sprite.borderSize;
    }

    desenharCentro(ctx) {
        ctx.fillStyle = "blue";
        ctx.lineWidth = 1;
        ctx.fillRect(this.x - 1, this.y - 1, 3, 3);
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, 1, 1);
    }

    desenharCentroHitBox(ctx) {
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.fillRect(this.hitBox.x - 1, this.hitBox.y - 1, 3, 3);
        ctx.fillStyle = "white";
        ctx.fillRect(this.hitBox.x, this.hitBox.y, 1, 1);
    }

    desenharCaixaColisao(ctx) {
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillRect(- this.w / 2, - this.h / 2, this.w, this.h);
        ctx.strokeRect(- this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    }

    /**
     * Desenha barra de tempo
     */

    desenharTempo(ctx) {
        ctx.fillStyle = this.colorBG;
        ctx.strokeStyle = this.colorBorder;
        ctx.lineWidth = this.borderSize;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    };

    desenharBarraEnergiaHUD(ctx, player) {
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillRect(this.x, this.y, this.w, this.h);         // Fundo
        ctx.fillStyle = `hsl(${120 * player.hp / player.maxHp}, 100%, 50%)`;
        ctx.fillRect(this.x, this.y, this.w * (Math.max(0, player.hp) / player.maxHp), this.h);         // Quantidade de HP
        ctx.strokeRect(this.x, this.y, this.w, this.h);       // Borda

        // Texto com o número no meio da barra
        ctx.font = "13px Arial Black";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center"; //alignMainMenu;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeText(player.hp, this.x + this.w / 2, this.y + this.h / 2 + 4);
        ctx.fillText(player.hp, this.x + this.w / 2, this.y + this.h / 2 + 4);
    };

    desenharCell(ctx) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
    };

    impoeLimites(x, y, w, h) {
        if (this.x + this.w < x) {
            this.x = x;
            this.vx = 0;
        }
        if (this.x + this.w > x + w) {
            this.x = x + w - this.w;
            this.vx = 0;
        }
        if (this.y < y) {
            this.y = y;
            this.vy = 0;
        }
        if (this.y + this.h > y + h) {
            this.y = y + h - this.h;
            this.vy = 0;
        }
    };

    /** 
     * ColidiuCom possui o ponto central do sprite no canto superior esquerdo
    */

    colidiuComEsquerdoSuperior(alvo) {
        if (alvo.x + alvo.w < this.x) return false;
        if (alvo.x - alvo.w > this.x + this.w) return false;

        if (alvo.y + alvo.h < this.y) return false;
        if (alvo.y + alvo.h > this.y + this.h) return false;
        return true;
    };

    /** 
     * Possui o ponto central do sprite no centro (TRABALHA COM SIZE)
    */

    colidiuComCentralSize(alvo) {
        if (alvo.x + alvo.s / 2 < this.x - this.s / 2) return false;
        if (alvo.x - alvo.s / 2 > this.x + this.s / 2) return false;

        if (alvo.y + alvo.s / 2 < this.y - this.s / 2) return false;
        if (alvo.y - alvo.s / 2 > this.y + this.s / 2) return false;
        return true;
    };

    /** 
     * Possui o ponto central do sprite no centro (TRABALHA COM WIDTH E HEIGHT)
    */

    colidiuComCentralWidthHeight(alvo) {
        if (alvo.x + alvo.w / 2 < this.x - this.w / 2) {
            return false;
        }
        if (alvo.x - alvo.w / 2 > this.x + this.w / 2) {
            return false;
        }

        if (alvo.y + alvo.h / 2 < this.y - this.h / 2) {
            return false;
        }
        if (alvo.y - alvo.h / 2 > this.y + this.h / 2) {
            return false;
        }
        return true;
    };

    static verificaColisao(primeiro, segundo) {
        if (primeiro == null || segundo == null) {
            return false;
        }
        if (primeiro.x - primeiro.w / 2 > segundo.x + segundo.w / 2 ||
            segundo.x - segundo.w / 2 > primeiro.x + primeiro.w / 2) {
            return false;
        }
        if (primeiro.y - primeiro.h / 2 > segundo.y + segundo.h / 2 ||
            segundo.y - segundo.h / 2 > primeiro.y + primeiro.h / 2) {
            return false;
        }
        return true;
    }


    /** 
     * Colisão usando hitbox como referencia
    */

    atacar(alvo) {
        if (alvo.x + alvo.w / 2 < this.hitBox.x - this.hitBox.w / 2) { return false; }
        if (alvo.x - alvo.w / 2 > this.hitBox.x + this.hitBox.w / 2) { return false; }

        if (alvo.y + alvo.h / 2 < this.hitBox.y - this.hitBox.h / 2) { return false; }
        if (alvo.y - alvo.h / 2 > this.hitBox.y + this.hitBox.h / 2) { return false; }

        return true;
    };

    hasPoint(point) {
        return !(
            this.x + this.w / 2 < point.x ||
            this.x - this.w / 2 > point.x ||
            this.y + this.h / 2 < point.y ||
            this.y - this.h / 2 > point.y
        );
    }

    //module.exports = Sprite;
}