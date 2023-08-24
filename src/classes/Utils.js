export function escreveTexto (ctx, texto, x, y) {
    ctx.strokeText(texto, x, y);
    ctx.fillText(texto, x, y);
  }

// Conversão de escalas para o canvas ocupando a tela toda
export function converteTelaCheia(valorAntigo, telaAntiga, telaNova) {
  let aux = Math.round(((valorAntigo * 100) / telaAntiga) * 100) / 100; // Arrendonda a porcentagem para duas casas decimais
  return Math.floor(parseInt((aux / 100) * telaNova));
}