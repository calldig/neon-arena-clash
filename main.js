// CONFIG PHASER
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
  },
  input: {
    activePointers: 3
  }
};

const game = new Phaser.Game(config);

// SCÈNE BOOT (chargement)
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }
  preload() {
    // On ajoutera des assets ici plus tard
  }
  create() {
    this.scene.start('TitleScene');
  }
}

// SCÈNE TITRE – ultra embellie
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    // Fond gradient animé (néon violet-cyan)
    const bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);
    const gradient = this.add.rectangle(0, 0, this.scale.width, this.scale.height);
    gradient.setFillGradientStyle(0x1a0033, 0x1a0033, 0x003366, 0x003366, 1);

    // Particules néon flottantes (glow)
    this.add.particles(0, 0, null, {
      speed: { min: 20, max: 60 },
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 4000,
      frequency: 150,
      tint: [0x00ffff, 0xff00ff, 0x00ff88, 0xff8800],
      alpha: { start: 0.9, end: 0 }
    });

    // Titre avec glitch + glow multiple
    const title = this.add.text(this.scale.width / 2, 120, 'NEON ARENA', {
      fontSize: '80px',
      fontFamily: 'Arial Black',
      color: '#00ffff',
      stroke: '#ff00ff',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, blur: 30, color: '#00ffff' }
    }).setOrigin(0.5);

    // Effet glitch léger sur titre
    this.tweens.add({
      targets: title,
      x: title.x + 4,
      yoyo: true,
      duration: 80,
      repeat: -1,
      repeatDelay: 3000,
      ease: 'Sine.easeInOut'
    });

    // Glow pulsant
    this.tweens.add({
      targets: title,
      alpha: 0.7,
      yoyo: true,
      duration: 1200,
      repeat: -1
    });

    // Bouton JOUER premium
    const playButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 80, 'JOUER', {
      fontSize: '60px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      backgroundColor: '#ff0066',
      padding: { x: 60, y: 30 },
      shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#ff0066' }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Animation hover
    playButton.on('pointerover', () => {
      playButton.setStyle({ backgroundColor: '#ff3399', scale: 1.1 });
    });
    playButton.on('pointerout', () => {
      playButton.setStyle({ backgroundColor: '#ff0066', scale: 1 });
    });

    // Animation clic down/up + lancement
    playButton.on('pointerdown', () => {
      this.tweens.add({
        targets: playButton,
        scale: 0.9,
        duration: 100,
        ease: 'Sine.easeIn'
      });
    });

    playButton.on('pointerup', () => {
      this.tweens.add({
        targets: playButton,
        scale: 1.1,
        duration: 100,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });

    // Texte subtil "Clique pour jouer"
    this.add.text(this.scale.width / 2, this.scale.height - 80, 'CLIQUE POUR JOUER', {
      fontSize: '28px',
      color: '#cccccc',
      alpha: 0.7
    }).setOrigin(0.5);
  }
}

// SCÈNE JEU (à embellir ensuite)
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Fond simple pour l'instant
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

    const playerCore = this.add.circle(150, this.scale.height / 2, 60, 0x00ffff);
    playerCore.setStrokeStyle(12, 0x00ffff, 0.8);
    this.add.text(150, this.scale.height / 2 - 120, 'TON NOYAU', {
      fontSize: '28px',
      color: '#00ffff'
    }).setOrigin(0.5);

    const enemyCore = this.add.circle(this.scale.width - 150, this.scale.height / 2, 60, 0xff00aa);
    enemyCore.setStrokeStyle(12, 0xff00aa, 0.8);
    this.add.text(this.scale.width - 150, this.scale.height / 2 - 120, 'NOYAU ENNEMI', {
      fontSize: '28px',
      color: '#ff00aa'
    }).setOrigin(0.5);

    this.energy = 0;
    this.energyText = this.add.text(20, 20, 'ÉNERGIE : 0/10', { fontSize: '32px', color: '#ffffff' });

    this.timeLeft = 180;
    this.timerText = this.add.text(this.scale.width / 2, 50, '03:00', { fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
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
