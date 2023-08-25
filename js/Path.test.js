import Path from "./Path";

const x = 1;
const y = 1;

describe("Classe Path", () => {
  describe("Está corretamente criada quando:", () => {
    it("É um objeto", () => {
      const path = new Path();
      expect(typeof path).toBe("object");
    });

    it("Contém uma matriz", () => {
      const path = new Path();
      expect(path.COLUNAS).toEqual(12);
      expect(path.LINHAS).toEqual(8);
    });

    it("Possui um tamanho maior do que zero", () => {
      const path = new Path();
      expect(path.SIZE).toEqual(32);
    });

    it("Possui uma cena", () => {
      const path = new Path();
      expect(path.cena).toBeDefined();
    });

    it("Steps está preenchido inicialmente com zeros", () => {
      const path = new Path();
      for (let l = 0; l < path.LINHAS; l++) {
        for (let c = 0; c < path.COLUNAS; c++) {
          expect(path.steps[l][c]).toEqual(0);
        }
      }
    });

  });

  describe("addStep está correto quando:", () => {
    it("Posição adicionada é igual a 1", () => {
      const path = new Path();
      expect(path.steps[x][y]).toEqual(0);
      path.addStep(x, y);
      expect(path.steps[x][y]).toEqual(1);
    });
  });
  
  describe("removeStep está correto quando:", () => {
    it("Posição removida é igual a 0", () => {
      const path = new Path();
      path.removeStep(x, y);
      expect(path.steps[x][y]).toEqual(0);
    });
  });
  
});
