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
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

    const title = this.add.text(this.scale.width / 2, 150, 'NEON ARENA', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#00ffff',
      stroke: '#ff00ff',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#00ffff' }
    }).setOrigin(0.5);

    const playButton = this.add.text(this.scale.width / 2, 300, 'JOUER', {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#ff00aa',
      padding: { x: 40, y: 20 }
    }).setOrigin(0.5).setInteractive();

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
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

    // Noyau joueur (gauche)
    const playerCore = this.add.circle(150, this.scale.height / 2, 60, 0x00ffff);
    playerCore.setStrokeStyle(8, 0x00ffff, 0.6);
    this.add.text(150, this.scale.height / 2 - 100, 'TON NOYAU', {
      fontSize: '24px',
      color: '#00ffff'
    }).setOrigin(0.5);

    // Noyau ennemi (droite)
    const enemyCore = this.add.circle(this.scale.width - 150, this.scale.height / 2, 60, 0xff00aa);
    enemyCore.setStrokeStyle(8, 0xff00aa, 0.6);
    this.add.text(this.scale.width - 150, this.scale.height / 2 - 100, 'NOYAU ENNEMI', {
      fontSize: '24px',
      color: '#ff00aa'
    }).setOrigin(0.5);

    // Énergie
    this.energy = 0;
    this.energyText = this.add.text(20, 20, 'ÉNERGIE : 0/10', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    });

    // Timer 3 min
    this.timeLeft = 180;
    this.timerText = this.add.text(this.scale.width / 2, 40, '03:00', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  update(time, delta) {
    this.energy += delta / 5000;
    if (this.energy > 10) this.energy = 10;
    this.energyText.setText(`ÉNERGIE : ${Math.floor(this.energy)}/10`);

    this.timeLeft -= delta / 1000;
    if (this.timeLeft < 0) this.timeLeft = 0;
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = Math.floor(this.timeLeft % 60);
    this.timerText.setText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }
}

// ───────────────────────────────────────────────
// Configuration Phaser (TOUJOURS après les classes !)
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#0a001f',
  scene: [BootScene, TitleScene, GameScene],  // Ordre d'exécution : Boot → Title → Game
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);
