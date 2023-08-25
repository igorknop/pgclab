import AssetsManager from "./AssetsManager";

export class AssetsManagerBuilder {
  _assetsManager = null;

  reset() {
    this._assetsManager = new AssetsManager();
  }

  build() {
    return this._assetsManager;
  }

  loadImages() {
  }

  loadSounds() {
  }

  loadFonts() {
  }


}