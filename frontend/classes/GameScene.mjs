export default class GameScene extends Phaser.Scene {
  movingPlatform;
  cursors;
  platforms;
  stars;
  player;

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, "sky");

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    this.movingPlatform = this.physics.add.image(400, 400, "ground");

    this.movingPlatform.setImmovable(true);
    this.movingPlatform.body.allowGravity = false;
    this.movingPlatform.setVelocityX(50);

    this.player = this.physics.add.sprite(100, 450, "dude");

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    for (const star of this.stars.getChildren()) {
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatform);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.stars, this.movingPlatform);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
  }

  update() {
    const { A, S, D, SPACE } = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (A.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (D.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (SPACE.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.movingPlatform.x >= 500) {
      this.movingPlatform.setVelocityX(-50);
    } else if (this.movingPlatform.x <= 300) {
      this.movingPlatform.setVelocityX(50);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
  }
}
