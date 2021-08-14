export default class Path{
  constructor(){
      this.steps = [];
      this.a = false;
  }

  desenhar(ctx,s,idTipo){
    switch(idTipo){
      case 0:{
        for(let i = 0; i < this.steps.length; i++){
          ctx.save();
          ctx.fillStyle = "#1E90FF";
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
          ctx.restore();
          ctx.fillStyle = "#1E90FF";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, (this.steps[i].notacaoTesouros), this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2 + 5);
          if(!this.a){
            console.log("Tesouros: " + this.steps.length);
            this.a = true;
          }
        }
        break;
      }
      case 1:{
        for(let i = 0; i < this.steps.length; i++){
          ctx.save();
          ctx.fillStyle = "#006400";
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
          ctx.restore();
          ctx.fillStyle = "#006400";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, (this.steps[i].notacaoPlayer), this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2 + 5);
          if(!this.a){
            console.log(this.steps.length);
            this.a = true;
          }
        }
        break;
      }
      default:{
        for(let i = 0; i < this.steps.length; i++){
          ctx.save();
          ctx.fillStyle = "red";
          ctx.linewidth = 1;
          ctx.globalAlpha = 0.1;
          ctx.fillRect(this.steps[i].coluna * s, this.steps[i].linha * s, s, s);
          ctx.restore();
          ctx.fillStyle = "red";
          ctx.strokeStyle = "black";
          this.escreveTexto(ctx, (this.steps[i].direcaoSaida)/*(i)*/, this.steps[i].coluna * s + s / 2, this.steps[i].linha * s + s / 2);
          if(!this.a){
            console.log("Básico: " + this.steps.length);
            this.a = true;
          }
        }
        break;
      }
        
    }
  }

    escreveTexto(ctx, texto, x, y) {
        ctx.strokeText(texto, x, y);
        ctx.fillText(texto, x, y);
    }

  addStep(bloco){
      this.steps.push(bloco);
  }
}