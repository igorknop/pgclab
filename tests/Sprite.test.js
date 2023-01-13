import Sprite  from "../classes/Sprite";

describe("Classe Sprite", () => {
  describe("Está corretamente criada quando: ", () => {

    it("É um objeto", () => {
      const sprite = new Sprite();
      expect(typeof sprite).toBe("object");
    });

    it("Possui tamanho válido", () => {
      const sprite = new Sprite();
      expect(sprite.h).toBeGreaterThanOrEqual(0);
      expect(sprite.w).toBeGreaterThanOrEqual(0);
    });

    it("Tem posição inicial", () => {
      const sprite = new Sprite();

      expect(sprite.x).toBeDefined();
      expect(sprite.y).toBeDefined();

      const sprite2 = new Sprite({ x: 10, y: 20 });
      expect(sprite2.x).toBe(10);
      expect(sprite2.y).toBe(20);
    });

    it("Tem velocidade 2d", () => {
      const sprite = new Sprite();
      expect(sprite.vx).toBeDefined();
      expect(sprite.vy).toBeDefined();

      const sprite2 = new Sprite({ vx: 10, vy: -10 });
      expect(sprite2.vx).toBe(10);
      expect(sprite2.vy).toBe(-10);
    });

    /*it("Tem uma cor", () => {                  //Problema com a cor
      const sprite = new Sprite();
      expect(sprite.colorBG).toBeDefined();
    });*/

    it("Tem mx e my = 0", () => {
      const sprite = new Sprite();
      expect(sprite.gx).toEqual(0);
      expect(sprite.gy).toEqual(0);
    });
  });
});
