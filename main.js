const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#0a001f',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

function preload() {
  // On chargera les assets néon ici plus tard
  this.load.image('background', 'assets/neon-bg.png'); // placeholder
}

function create() {
  // Fond néon simple
  this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x0a001f).setOrigin(0);

  // Texte titre glow
  const title = this.add.text(this.scale.width / 2, 150, 'NEON ARENA', {
    fontSize: '64px',
    fontFamily: 'Arial',
    color: '#00ffff',
    stroke: '#ff00ff',
    strokeThickness: 6,
    shadow: { offsetX: 0, offsetY: 0, blur: 20, color: '#00ffff' }
  }).setOrigin(0.5);

  // Bouton "Jouer" (plus tard interactif)
  const playButton = this.add.text(this.scale.width / 2, 300, 'JOUER', {
    fontSize: '48px',
    color: '#ffffff',
    backgroundColor: '#ff00aa',
    padding: { x: 40, y: 20 }
  }).setOrigin(0.5).setInteractive();

  playButton.on('pointerdown', () => {
    console.log('Lancement du jeu !');
    // Plus tard : start scene de jeu
  });

  // Effet glow simple (on améliorera)
  this.tweens.add({
    targets: title,
    alpha: 0.6,
    yoyo: true,
    duration: 1500,
    repeat: -1
  });
}

function update() {}
