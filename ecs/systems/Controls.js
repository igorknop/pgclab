function keydown(entityManager, { e }) {
  entityManager.entities.forEach((entity) => {
    const v = entity.get("VELOCITY");
    switch (e.key) {
      case "w":
        v.ay = -120;
        break;
      case "s":
        v.ay = +120;
        break;
      case "a":
        v.ax = -120;
        break;
      case "d":
        v.ax = +120;
        break;

      default:
        break;
    }
  });
}

function keyup(entityManager, { e }) {
  entityManager.entities.forEach((entity) => {
    const v = entity.get("VELOCITY");
    switch (e.key) {
      case "w":
        v.ay = 0;
        break;
      case "s":
        v.ay = 0;
        break;
      case "a":
        v.ax = 0;
        break;
      case "d":
        v.ax = 0;
        break;

      default:
        break;
    }
  });
}

export { keydown, keyup };
