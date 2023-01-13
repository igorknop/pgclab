import Sprite from "./Sprite.js";
import assetsMng from "./AssetsMng.js";
import Hud from "./Hud.js";


export default class Teleporter extends Sprite {

	constructor(type = null) {
		super({ s: 32, w: 32, h: 32 });

		this.hud = Hud.getInstance();
		this.proximoTeleporte = undefined;
		this.type = type;
		this.roomNumber = -1;
		this.ativo = true;
	}

	/**
	 * GX => Coluna;
	 * GY => Linha
	 */

	/**
	 * Retorna a referencia pra celula diretamente no mapa
	 */

	getCell() {
		return this.map.cell[this.gy][this.gx];
	}

	setPosition(linha, coluna) {
		this.x = coluna * this.s + this.s / 2;
		this.y = linha * this.s + this.s / 2;
	}

	setPosition(celula) {
		this.x = celula.coluna * this.s + this.s / 2;
		this.y = celula.linha * this.s + this.s / 2;
	}

	setType(type) {
		this.type = type;
		return this;
	}

	setAtivo(ativo) {
		this.ativo = ativo;
		return this;
	}

	copyTeleporte(teleporter, rooms) {
		//this.proximoTeleporte = teleporter.proximoTeleporte;
		this.type = teleporter.type;
		this.roomNumber = teleporter.roomNumber;
		this.ativo = teleporter.ativo;
		this.copy(teleporter);                              //Copia os dados do sprite
	}

	copyConnection(teleporter, rooms) {
		// Copiando o proximo teleporte
		if (teleporter.proximoTeleporte != undefined) {
			let aux = rooms[teleporter.proximoTeleporte.roomNumber - 1];
			if (this.type === TeleporterType.InicioSala) {
				this.proximoTeleporte = aux.teleporterFinal;
			}
			else {
				this.proximoTeleporte = aux.teleporterInitial;
			}
			/*if(teleporter.proximoTeleporte.type === 2){     // inicio de sala
			  this.proximoTeleporte = aux.teleporterInitial;
			}
			else{                                           // Final de sala
			  this.proximoTeleporte = aux.teleporterFinal;
			}*/
		}
	}

	teleportar(player, levelAtual) {
		if (!this.ativo) {
			console.log('Teleporte inativo');
			return;
		}
		if (this.proximoTeleporte != undefined) {
			assetsMng.play("teleporte");
			player.x = this.proximoTeleporte.x;
			player.y = this.proximoTeleporte.y;
			player.gx = this.proximoTeleporte.gx;
			player.gy = this.proximoTeleporte.gy;
			player.room = this.proximoTeleporte.roomNumber;
			this.hud.bussola.update(levelAtual);
			this.hud.atualizarGrafico(levelAtual);
		}
		else {
			console.log("proximoTeleporte eh undefined !!!");
		}
	}

	desenhar(ctx) {
		switch (this.type) {
			case TeleporterType.InicioLevel:                     // Início de fase
				{
					ctx.strokeStyle = "dark green";
					ctx.fillStyle = "green";
					ctx.linewidth = 10;
					ctx.save();
					ctx.globalAlpha = 0.40;         //Transparência
					ctx.translate(this.x, this.y);
					ctx.fillRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.strokeRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.restore();
				}
				break;
			case TeleporterType.FimLevel:                     // Final de fase
				{
					ctx.strokeStyle = "purple";
					ctx.fillStyle = "rgb(84, 98, 139)";
					ctx.linewidth = 10;
					ctx.save();
					ctx.globalAlpha = 0.60;         //Transparência
					ctx.translate(this.x, this.y);
					ctx.fillRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.strokeRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.restore();
				}
				break;
			case TeleporterType.InicioSala:                           // Teleporte Inicial room
				{
					ctx.strokeStyle = "darkblue";
					ctx.fillStyle = "blue";
					ctx.linewidth = 10;
					ctx.save();
					ctx.globalAlpha = 0.60;         //Transparência
					ctx.translate(this.x, this.y);
					ctx.fillRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.strokeRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.restore();
				}
				break;
			case TeleporterType.FimSala:                         // Teleporte final room
				{
					ctx.strokeStyle = "Yellow";
					ctx.fillStyle = "Orange";
					ctx.linewidth = 100;
					ctx.save();
					ctx.globalAlpha = 0.40;         //Transparência
					ctx.translate(this.x, this.y);
					ctx.fillRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.strokeRect(-this.s / 2, -this.s / 2, this.s, this.s);
					ctx.restore();
				}
				break;
			default:
				console.log("Sprite type " + this.type + " is wrong!!!",);
				break;
		}
	}

}

export class TeleporterType {
	static InicioLevel = new TeleporterType(0)
	static FimLevel = new TeleporterType(1)
	static InicioSala = new TeleporterType(2)
	static FimSala = new TeleporterType(3)

	constructor(tipo) {
		this.tipo = tipo;
	}
}