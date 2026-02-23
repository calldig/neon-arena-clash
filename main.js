// === CONFIG PHASER ===
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#0a001f',
  scene: [],  // On ajoute les scènes après leur définition
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3  // Support multi-touch mobile + Telegram
  }
};

// === SCÈNE BOOT ===
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Placeholder futur
    // this.load.image('background', 'assets/neon-bg.png');
  }

  create() {
    console.log('BootScene OK → passe à TitleScene');
    this.scene.start('TitleScene');
  }
}

// === SCÈNE TITRE ===
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    console.log('TitleScene chargée');

    // Fond
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

    // Titre
    const title = this.add.text(this.scale.width / 2, 150, 'NEON ARENA', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#00ffff',
      stroke: '#ff00ff',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#00ffff' }
    }).setOrigin(0.5);

    // Bouton JOUER
    const playButton = this.add.text(this.scale.width / 2, 300, 'JOUER', {
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#ff00aa',
      padding: { x: 40, y: 20 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Feedback visuel sur hover/touch
    playButton.on('pointerover', () => {
      playButton.setStyle({ backgroundColor: '#ff33cc' });
    });
    playButton.on('pointerout', () => {
      playButton.setStyle({ backgroundColor: '#ff00aa' });
    });

    // Clic → lance la scène jeu
    playButton.on('pointerup', () => {
      console.log('BOUTON JOUER CLIQUE → lancement GameScene');
      this.scene.start('GameScene');
    });

    // Glow titre
    this.tweens.add({
      targets: title,
      alpha: 0.6,
      yoyo: true,
      duration: 1500,
      repeat: -1
    });
  }
}

// === SCÈNE JEU ===
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene chargée');

    // Fond
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

    // Noyau joueur
    const playerCore = this.add.circle(150, this.scale.height / 2, 60, 0x00ffff);
    playerCore.setStrokeStyle(12, 0x00ffff, 0.8);
    this.add.text(150, this.scale.height / 2 - 120, 'TON NOYAU', {
      fontSize: '28px',
      color: '#00ffff',
      stroke: '#00ffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Noyau ennemi
    const enemyCore = this.add.circle(this.scale.width - 150, this.scale.height / 2, 60, 0xff00aa);
    enemyCore.setStrokeStyle(12, 0xff00aa, 0.8);
    this.add.text(this.scale.width - 150, this.scale.height / 2 - 120, 'NOYAU ENNEMI', {
      fontSize: '28px',
      color: '#ff00aa',
      stroke: '#ff00aa',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Énergie
    this.energy = 0;
    this.energyText = this.add.text(20, 20, 'ÉNERGIE : 0/10', {
      fontSize: '32px',
      color: '#ffffff'
    });

    // Timer
    this.timeLeft = 180;
    this.timerText = this.add.text(this.scale.width / 2, 50, '03:00', {
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

// === LANCE PHASER ===
config.scene = [BootScene, TitleScene, GameScene];
const game = new Phaser.Game(config);
