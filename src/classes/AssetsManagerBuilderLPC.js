import imgBrickGray from "../../assets/images/brick_gray.png";
import imgBrickDark from "../../assets/images/brick_dark0.png";
import imgCoinCopper from "../../assets/images/coin_copper.png";
import imgCoinGold from "../../assets/images/coin_gold.png";
import imgCoinSilver from "../../assets/images/coin_silver.png";
import imgFlames from "../../assets/images/flames.png";
import imgGrassFull from "../../assets/images/grass_full.png";
import imgFloorSand from "../../assets/images/floor_sand_stone0.png";
import imgPlayerSprite from "../../assets/images/player-sprite.png";
import imgRock from "../../assets/images/rock.png";
import imgSlime from "../../assets/images/slime.png";
import audioTeleport from "../../assets/audios/Teleport.wav";
import { AssetsManagerBuilder } from "./AssetsManagerBuilder";

export class AssetsManagerBuilderLPC extends AssetsManagerBuilder {
  loadImages() {
    this._assetsManager.loadImage("brick_gray", imgBrickGray);
    this._assetsManager.loadImage("brick_dark_Tp_0", imgBrickDark);
    this._assetsManager.loadImage("coin_copper", imgCoinCopper);
    this._assetsManager.loadImage("coin_gold", imgCoinGold);
    this._assetsManager.loadImage("coin_silver", imgCoinSilver);
    this._assetsManager.loadImage("flames", imgFlames);
    this._assetsManager.loadImage("floor_sand", imgFloorSand);
    this._assetsManager.loadImage("grass_full", imgGrassFull);
    this._assetsManager.loadImage("player", imgPlayerSprite);
    this._assetsManager.loadImage("rockBlock", imgRock);
    this._assetsManager.loadImage("slime", imgSlime);
  }
  loadSounds() {
    this._assetsManager.loadAudio("teleporte", audioTeleport);
  }
  build() {
    this.reset();
    this.loadImages();
    this.loadSounds();
    return super.build();
  }
}
