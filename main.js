// ───────────────────────────────────────────────
// Scène de chargement (Boot) - charge les assets futurs
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Placeholder pour plus tard
    this.load.image('background', 'assets/neon-bg.png');
  }

  create() {
    this.scene.start('TitleScene'); // → passe à l'écran titre
  }
}

// ───────────────────────────────────────────────
// Écran titre avec bouton JOUER
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f)
      .setOrigin(0);

    const title = this.add
      .text(this.scale.width / 2, 150, 'NEON ARENA', {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#00ffff',
        stroke: '#ff00ff',
        strokeThickness: 6,
        shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#00ffff' }
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(this.scale.width / 2, 300, 'JOUER', {
        fontSize: '48px',
        color: '#ffffff',
        backgroundColor: '#ff00aa',
        padding: { x: 40, y: 20 }
      })
      .setOrigin(0.5)
      .setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.tweens.add({
      targets: title,
      alpha: 0.6,
      yoyo: true,
      duration: 1500,
      repeat: -1
    });
  }
}

// ───────────────────────────────────────────────
// Arène de jeu (V1 basique)
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Fond gradient néon
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f)
      .setOrigin(0);

    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height)
      .setFillGradientStyle(0x0a001f, 0x0a001f, 0x1a0033, 0x1a0033, 1)
      .setOrigin(0);

    // Grille cyberpunk
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x00ffff, 0.15);

    for (let x = 0; x < this.scale.width; x += 80) {
      grid.lineBetween(x, 0, x, this.scale.height);
    }

    for (let y = 0; y < this.scale.height; y += 80) {
      grid.lineBetween(0, y, this.scale.width, y);
    }

    // Noyau joueur
    const playerCore = this.add.circle(
      150,
      this.scale.height / 2,
      60,
      0x00ffff
    );

    playerCore.setStrokeStyle(12, 0x00ffff, 0.8);

    this.add.circle(150, this.scale.height / 2, 70, 0x00ffff, 0.3);
    this.add.circle(150, this.scale.height / 2, 90, 0x00ffff, 0.1);

    this.add
      .text(150, this.scale.height / 2 - 120, 'TON NOYAU', {
        fontSize: '28px',
        fontFamily: 'Arial',
        color: '#00ffff',
        stroke: '#00ffff',
        strokeThickness: 4,
        shadow: { offsetX: 0, offsetY: 0, blur: 15, color: '#00ffff' }
      })
      .setOrigin(0.5);

    // Noyau ennemi
    const enemyCore = this.add.circle(
      this.scale.width - 150,
      this.scale.height / 2,
      60,
      0xff00aa
    );

    enemyCore.setStrokeStyle(12, 0xff00aa, 0.8);

    this.add.circle(this.scale.width - 150, this.scale.height / 2, 70, 0xff00aa, 0.3);
    this.add.circle(this.scale.width - 150, this.scale.height / 2, 90, 0xff00aa, 0.1);

    this.add
      .text(
        this.scale.width - 150,
        this.scale.height / 2 - 120,
        'NOYAU ENNEMI',
        {
          fontSize: '28px',
          fontFamily: 'Arial',
          color: '#ff00aa',
          stroke: '#ff00aa',
          strokeThickness: 4,
          shadow: { offsetX: 0, offsetY: 0, blur: 15, color: '#ff00aa' }
        }
      )
      .setOrigin(0.5);

    // Pulsation
    this.tweens.add({
      targets: [playerCore, enemyCore],
      scale: 1.1,
      yoyo: true,
      duration: 2000,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // UI énergie
    this.energy = 0;

    this.energyBar = this.add
      .rectangle(20, 20, 200, 40, 0x00ffff, 0.3)
      .setOrigin(0);

    this.energyFill = this.add
      .rectangle(20, 40, 0, 40, 0x00ffff)
      .setOrigin(0, 0.5);

    this.energyText = this.add
      .text(120, 20, 'ÉNERGIE 0/10', {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#00ffff',
        strokeThickness: 3
      })
      .setOrigin(0.5);

    // Timer
    this.timeLeft = 180;

    this.timerText = this.add
      .text(this.scale.width / 2, 50, '03:00', {
        fontSize: '48px',
        color: '#ffffff',
        stroke: '#ff00ff',
        strokeThickness: 6,
        shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#ff00ff' }
      })
      .setOrigin(0.5);
  }

  update(time, delta) {
    this.energy += delta / 5000;

    if (this.energy > 10) {
      this.energy = 10;
    }

    this.energyFill.width = (this.energy / 10) * 200;
    this.energyText.setText(`ÉNERGIE ${Math.floor(this.energy)}/10`);

    this.timeLeft -= delta / 1000;

    if (this.timeLeft < 0) {
      this.timeLeft = 0;
    }

    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = Math.floor(this.timeLeft % 60);

    this.timerText.setText(
      `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    );
  }
}

// ───────────────────────────────────────────────
// Configuration Phaser
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#0a001f',
  scene: [BootScene, TitleScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
