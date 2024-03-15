import GameScene from "./classes/GameScene.mjs";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "phaser-example",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: GameScene,
};

const game = new Phaser.Game(config);
