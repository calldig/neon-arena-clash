/**
 * NEON ARENA – Phaser 3 Game
 * Architecture : BootScene → TitleScene → GameScene
 */

// ─────────────────────────────────────────────
// CONSTANTES GLOBALES
// ─────────────────────────────────────────────
const COLORS = {
  BG:          0x0a001f,
  CYAN:        0x00ffff,
  MAGENTA:     0xff00ff,
  PINK:        0xff0066,
  PINK_LIGHT:  0xff3399,
  PINK_ENEMY:  0xff00aa,
  GREEN:       0x00ff88,
  ORANGE:      0xff8800,
  DARK_PURPLE: 0x1a0033,
  DARK_BLUE:   0x003366,
};

const FONTS = {
  PRIMARY:   { fontFamily: '"Arial Black", Arial, sans-serif' },
  SECONDARY: { fontFamily: 'Arial, sans-serif' },
};

const GAME_DURATION = 180; // secondes
const MAX_ENERGY    = 10;

// ─────────────────────────────────────────────
// SCÈNE BOOT
// ─────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Placeholder – chargement futur des assets
  }

  create() {
    console.log('[BootScene] Chargement terminé → TitleScene');
    this.scene.start('TitleScene');
  }
}

// ─────────────────────────────────────────────
// SCÈNE TITRE
// ─────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    console.log('[TitleScene] Écran titre chargé');

    // Fond gradient animé
    const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);
    const gradient = this.add.rectangle(0, 0, this.scale.width, this.scale.height);
    gradient.setFillGradientStyle(0x1a0033, 0x1a0033, 0x003366, 0x003366, 1);

    // Particules néon
    this.add.particles(0, 0, null, {
      speed: { min: 20, max: 60 },
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 4000,
      frequency: 150,
      tint: [0x00ffff, 0xff00ff, 0x00ff88, 0xff8800],
      alpha: { start: 0.9, end: 0 }
    });

    // Titre avec glitch + glow
    const title = this.add.text(this.scale.width / 2, 120, 'NEON ARENA', {
      fontSize: '80px',
      fontFamily: 'Arial Black',
      color: '#00ffff',
      stroke: '#ff00ff',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, blur: 30, color: '#00ffff' }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      x: title.x + 4,
      yoyo: true,
      duration: 80,
      repeat: -1,
      repeatDelay: 3000,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: title,
      alpha: 0.7,
      yoyo: true,
      duration: 1200,
      repeat: -1
    });

    // Bouton JOUER
    const playButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'JOUER', {
      fontSize: '60px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      backgroundColor: '#ff0066',
      padding: { x: 60, y: 30 },
      shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#ff0066' }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playButton.on('pointerover', () => {
      playButton.setStyle({ backgroundColor: '#ff3399' });
      playButton.setScale(1.1);
    });

    playButton.on('pointerout', () => {
      playButton.setStyle({ backgroundColor: '#ff0066' });
      playButton.setScale(1);
    });

    playButton.on('pointerdown', () => {
      this.tweens.add({ targets: playButton, scale: 0.9, duration: 100 });
    });

    playButton.on('pointerup', () => {
      this.tweens.add({
        targets: playButton,
        scale: 1.1,
        duration: 100,
        onComplete: () => {
          console.log('[TitleScene] Bouton cliqué → GameScene');
          this.scene.start('GameScene');
        }
      });
    });

    // Texte hint
    this.add.text(this.scale.width / 2, this.scale.height - 80, 'CLIQUE POUR JOUER', {
      fontSize: '28px',
      color: '#cccccc',
      alpha: 0.7
    }).setOrigin(0.5);
  }
}

// ─────────────────────────────────────────────
// SCÈNE JEU
// ─────────────────────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('[GameScene] Arène chargée');

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
    this.energyText = this.add.text(20, 20, 'ÉNERGIE : 0/10', { fontSize: '32px', color: '#ffffff' });

    // Timer
    this.timeLeft = GAME_DURATION;
    this.timerText = this.add.text(this.scale.width / 2, 50, '03:00', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
  }

  update(time, delta) {
    this.energy += delta / 5000;
    if (this.energy > MAX_ENERGY) this.energy = MAX_ENERGY;
    this.energyText.setText(`ÉNERGIE : \( {Math.floor(this.energy)}/ \){MAX_ENERGY}`);

    this.timeLeft -= delta / 1000;
    if (this.timeLeft < 0) this.timeLeft = 0;
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = Math.floor(this.timeLeft % 60);
    this.timerText.setText(`\( {minutes.toString().padStart(2, '0')}: \){seconds.toString().padStart(2, '0')}`);
  }
}

// ─────────────────────────────────────────────
// LANCEMENT FINAL (après toutes les classes)
// ─────────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: COLORS.BG,
  scene: [BootScene, TitleScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3
  }
};

const game = new Phaser.Game(config);
