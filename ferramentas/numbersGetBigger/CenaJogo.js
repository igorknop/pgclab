import Cena from "./Cena.js";
import Sprite from "../../js/Sprite.js";
import Button from "../../js/utils/Button.js";
import getXY from "../../js/utils/getXY.js";

export default class CenaJogo extends Cena {
	constructor(canvas = null, assets = null) {
		super(canvas, assets);
		// this.recursos = recursosNormal;
		this.taxaPonto = 0;
		this.pontosGastos = 0;
		this.pontosAtuais = 100;
		this.mapaTeclado = {
			a: false,
			b: false,
			c: false,
			d: false,
			e: false,
			"+": false
		}
		this.log = {
			upgrades: [],
			registros: []
		}
		this.espacoPressionado = false;
	}

	desenhar() {
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.desenharTextos();
		this.desenharTabela();
		super.desenharBotoes();
	}

	desenharTextos() {
		this.ctx.font = "20px Times";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "left";
		this.ctx.fillText("Poder: ", 50, 50);
		this.ctx.fillText(this.pontosAtuais.toFixed(1), 125, 50);
		this.ctx.fillText("Taxa: ", 50, 75);
		this.ctx.fillText(this.taxaPonto + " /s", 125, 75);
		this.ctx.fillText("Gasto: ", 50, 100);
		this.ctx.fillText(this.pontosGastos, 125, 100);
		this.ctx.fillText("Tempo: ", 785, 40);
		this.ctx.fillText(this.temporizador.toFixed(0), 850, 40);
	}

	desenharTabela() {
		let startX = 20;
		let startY = 150;
		let offsetX = 150;
		let offsetY = 50;
		// this.ctx.textAlign = "center";
		this.ctx.fillText("Recurso", startX, startY);
		this.ctx.fillText("Incremento", startX + offsetX, startY);
		this.ctx.fillText("Incremento total", startX + 2 * offsetX, startY);
		this.ctx.fillText("Quantidade", startX + 3 * offsetX, startY);
		this.ctx.fillText("Custo", startX + 4 * offsetX, startY);
		startY += offsetY;
		let best = this.recursos[0];
		let custoBeneficioAtual = best.currentCost / best.income;
		this.recursos.forEach(resource => {
			let custoBeneficio = resource.currentCost / resource.income;
			if (custoBeneficio < custoBeneficioAtual) {
				best = resource;
				custoBeneficioAtual = best.currentCost / best.income;
			}
		});
		this.recursos.forEach((resource) => {
			this.ctx.fillStyle = best.label == resource.label ? "red" : "white";
			this.ctx.fillText(resource.name, startX, startY);
			this.ctx.fillText(resource.income, startX + offsetX, startY);
			this.ctx.fillText(
				parseFloat((resource.income * resource.quantity).toFixed(10)),
				startX + 2 * offsetX,
				startY
			);
			this.ctx.fillText(resource.quantity, startX + 3 * offsetX, startY);
			this.ctx.fillText(resource.currentCost, startX + 4 * offsetX, startY);
			startY += offsetY;
		});
	}

	createAreas() {
		this.powerUpButton = this.adicionarBotao(new Button(
			0.7 * this.canvas.width,
			0.2 * this.canvas.height,
			0.15 * this.canvas.width,
			0.07 * this.canvas.height,
			"Power up!"
		));
	}

	quadro(t) {
		super.quadro(t);
		this.controle();
		this.pontosAtuais = parseFloat(
			(this.pontosAtuais + this.taxaPonto * this.dt).toFixed(10)
		);
		if (this.counter >= 1) {
			// this.log.registros.push({
			// 	"tempo": this.temporizador.toFixed(0),
			// 	"totalGasto": this.pontosGastos,
			// 	"taxaAtual": this.taxaPonto,
			// 	"poderAtual": this.pontosAtuais.toFixed(1)
			// });
			// this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
			// this.game.graph.atualizarGrafico();
			// console.log(this.log);
			this.counter = 0;
		}
		// if (this.temporizador.toFixed(0) % 5 === 0) {
		// 	this.game.graph.atualizarGrafico();
		// }
	}

	// Controle dos inputs do teclado
	controle() {
		// if (this.input.comandos.get("PAUSAR_JOGO")) {
		// 	console.log("Teste12");
		// 	this.pausarJogo();
		// 	return;
		// }
		// Atalho para aumentar pontos
		if (this.input.comandos.get("MIL")) {
			if (!this.mapaTeclado["+"]) {
				this.mapaTeclado["+"] = true;
				this.pontosAtuais += 1000;
			}
			return;
		} else {
			this.mapaTeclado["+"] = false;
		}
		this.heuristica?.controle(this);
		for (let i = 0; i < this.recursos.length; i++) {
			const element = this.recursos[i];
			if (this.input.comandos.get(element.label)) {
				if (!this.mapaTeclado[element.label]) {
					this.mapaTeclado[element.label] = true;
					if (this.pontosAtuais >= element.currentCost) {
						this.upgrade(element);
					}
					return;
				}
			} else {
				this.mapaTeclado[element.label] = false;
			}
		}
	}

	quandoColidir(a, b) {
		// if(a.tags.has("pc") && b.tags.has("coin")){
		//     if(!this.aRemover.includes(b)){
		//         this.aRemover.push(b);
		//         a.distancias.clear();
		//     }
		//     this.game.moedas += 1;
		// }
		// if(a.tags.has("pc") && b.tags.has("exit")){ // Se pc colidir com saída, remove os dois e reinicia a cena
		//     if(!this.aRemover.includes(a)){
		//         this.aRemover.push(a);
		//     }
		//     if(!this.aRemover.includes(b)){
		//         this.aRemover.push(b);
		//     }
		//     this.game.selecionaCena("fase1");
		// }
	}


	obterRecursoPorNome(nome) {
		let resource = null;
		for (let i = 0; i < this.recursos.length; i++) {
			const res = this.recursos[i];
			if (res.name === nome) {
				resource = res;
				break;
			}
		}
		return resource;
	}

	preparar() {
		super.preparar();
		this.createAreas();
		this.canvas.onmousedown = (e) => {
			this.mousedown(e);
		};
		this.canvas.onmousemove = (e) => {
			this.mousemove(e);
		};
		this.canvas.onclick = (e) => {
			this.click(e);
		};
	}

	mousedown(e) {
		if (this.assets.progresso() < 100.0 || this.expire > 0) {
			return;
		}
	}

	mousemove(e) {
		super.mousemove(e);
	}

	click(e) {
		this.mousedown(e);
		const [x, y] = getXY(e, this.canvas);
		if (this.powerUpButton.hasPoint({ x, y })) {
			this.powerUp();
		}
	}

	desenharHud() {
		// Fase
		this.ctx.font = "15px Arial";
		this.ctx.textAlign = "left";
		this.ctx.fillStyle = "white";
		this.ctx.fillText("Moedas coletadas: " + this.game.moedas, 10, 20);
		this.ctx.fillText("Sprites na tela: " + this.sprites.length, 10, 40);
	}

	upgrade(resource) {
		if (resource.currentCost > this.pontosAtuais)
			return;
		this.pontosAtuais = parseFloat(
			(this.pontosAtuais - resource.currentCost).toFixed(10)
		);
		this.pontosGastos += parseFloat(
			resource.currentCost.toFixed(10)
		);
		resource.quantity++;
		this.taxaPonto = parseFloat(
			(this.taxaPonto + resource.income).toFixed(10)
		);
		this.log.upgrades.push({
			"recursoMelhorado": resource.label,
			"custo": resource.currentCost,
		});
		resource.currentCost = Math.round(
			resource.initialCost * Math.pow(1.15, resource.quantity)
		);
		this.game.graph.adicionarDado(parseInt(this.temporizador), this.taxaPonto);
		this.game.graph.atualizarGrafico()
		// this.game.graph.adicionarDado(resource.currentIncome, resource.currentCost);
		// this.game.graph.atualizarGrafico();
		return;
	}

	powerUp() {
		const pointer = this.obterRecursoPorNome("Pointer");
		this.pontosAtuais = parseFloat(
			(
				this.pontosAtuais +
				1 +
				pointer.quantity * pointer.income
			).toFixed(10)
		);
	}
}
