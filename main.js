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
// CONFIGURATION PHASER
// ─────────────────────────────────────────────
const config = {
  type:            Phaser.AUTO,
  width:           window.innerWidth,
  height:          window.innerHeight,
  parent:          'game-container',
  backgroundColor: '#0a001f',
  scene:           [BootScene, TitleScene, GameScene],
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 3,
  },
};

const game = new Phaser.Game(config);

// ─────────────────────────────────────────────
// BOOT SCENE – Chargement des assets
// ─────────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Chargement des assets (textures, sons, atlas…)
    // this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.scene.start('TitleScene');
  }
}

// ─────────────────────────────────────────────
// TITLE SCENE – Écran d'accueil premium
// ─────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this._createBackground(width, height);
    this._createParticles(width, height);
    this._createTitle(cx);
    this._createSubtitle(cx, cy);
    this._createPlayButton(cx, cy);
    this._createFooterHint(cx, height);
  }

  // ── Fond dégradé violet → bleu nuit ──────────
  _createBackground(width, height) {
    this.add.rectangle(0, 0, width, height, COLORS.BG).setOrigin(0);

    const gradient = this.add.rectangle(0, 0, width, height).setOrigin(0);
    gradient.setFillGradientStyle(
      COLORS.DARK_PURPLE, COLORS.DARK_PURPLE,
      COLORS.DARK_BLUE,   COLORS.DARK_BLUE,
      1
    );
  }

  // ── Particules néon flottantes ────────────────
  _createParticles(width, height) {
    const emitter = this.add.particles(0, 0, null, {
      x:          { min: 0,  max: width  },
      y:          { min: 0,  max: height },
      speedX:     { min: -30, max: 30   },
      speedY:     { min: -30, max: 30   },
      scale:      { start: 0.8, end: 0  },
      alpha:      { start: 0.9, end: 0  },
      blendMode:  'ADD',
      lifespan:   4000,
      frequency:  120,
      tint:       [COLORS.CYAN, COLORS.MAGENTA, COLORS.GREEN, COLORS.ORANGE],
    });
  }

  // ── Titre principal avec glitch + pulse ───────
  _createTitle(cx) {
    const title = this.add.text(cx, 120, 'NEON ARENA', {
      ...FONTS.PRIMARY,
      fontSize:        '80px',
      color:           '#00ffff',
      stroke:          '#ff00ff',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, blur: 40, color: '#00ffff', fill: true },
    }).setOrigin(0.5);

    // Glitch horizontal périodique
    this.tweens.add({
      targets:     title,
      x:           cx + 5,
      yoyo:        true,
      duration:    80,
      repeat:      -1,
      repeatDelay: 3500,
      ease:        'Sine.easeInOut',
    });

    // Pulsation alpha (effet glow)
    this.tweens.add({
      targets:  title,
      alpha:    0.65,
      yoyo:     true,
      duration: 1200,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });
  }

  // ── Sous-titre ────────────────────────────────
  _createSubtitle(cx, cy) {
    this.add.text(cx, cy - 60, 'TOWER DEFENSE · NÉON · STRATÉGIE', {
      ...FONTS.SECONDARY,
      fontSize:        '22px',
      color:           '#aaaaff',
      letterSpacing:   4,
      alpha:           0.8,
    }).setOrigin(0.5);
  }

  // ── Bouton JOUER interactif ───────────────────
  _createPlayButton(cx, cy) {
    const btn = this.add.text(cx, cy + 80, '  JOUER  ', {
      ...FONTS.PRIMARY,
      fontSize:        '58px',
      color:           '#ffffff',
      backgroundColor: '#ff0066',
      padding:         { x: 60, y: 28 },
      shadow: { offsetX: 0, offsetY: 0, blur: 24, color: '#ff0066', fill: true },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulse d'entrée
    this.tweens.add({
      targets:  btn,
      scaleX:   1.04,
      scaleY:   1.04,
      yoyo:     true,
      duration: 900,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });

    // Hover
    btn.on('pointerover', () => {
      btn.setStyle({ backgroundColor: '#ff3399' });
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: 1.12, duration: 120, ease: 'Back.easeOut' });
    });

    btn.on('pointerout', () => {
      btn.setStyle({ backgroundColor: '#ff0066' });
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: 1.0, duration: 150, ease: 'Sine.easeOut' });
    });

    // Press
    btn.on('pointerdown', () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: 0.92, duration: 80, ease: 'Sine.easeIn' });
    });

    // Release → lancer la partie
    btn.on('pointerup', () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({
        targets:    btn,
        scale:      1.08,
        duration:   120,
        ease:       'Back.easeOut',
        onComplete: () => {
          this.cameras.main.fadeOut(400, 10, 0, 31);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
          });
        },
      });
    });
  }

  // ── Hint bas de page ──────────────────────────
  _createFooterHint(cx, height) {
    const hint = this.add.text(cx, height - 70, '↑  CLIQUE POUR JOUER  ↑', {
      ...FONTS.SECONDARY,
      fontSize: '20px',
      color:    '#888888',
    }).setOrigin(0.5);

    this.tweens.add({
      targets:  hint,
      alpha:    0.2,
      yoyo:     true,
      duration: 1400,
      repeat:   -1,
      ease:     'Sine.easeInOut',
    });
  }
}

// ─────────────────────────────────────────────
// GAME SCENE – Plateau de jeu principal
// ─────────────────────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // ── Initialisation des variables d'état ───────
  init() {
    this._energy  = 0;
    this._timeLeft = GAME_DURATION;
  }

  create() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;

    this._createBackground(width, height);
    this._createPlayerCore(cy);
    this._createEnemyCore(width, cy);
    this._createDivider(cx, height);
    this._createHUD(width, cx);
  }

  // ── Fond ──────────────────────────────────────
  _createBackground(width, height) {
    this.add.rectangle(0, 0, width, height, COLORS.BG).setOrigin(0);
  }

  // ── Noyau joueur (gauche) ─────────────────────
  _createPlayerCore(cy) {
    const core = this.add.circle(150, cy, 60, COLORS.CYAN, 0.15);
    core.setStrokeStyle(4, COLORS.CYAN, 1);

    // Halo animé
    const halo = this.add.circle(150, cy, 60, COLORS.CYAN, 0);
    halo.setStrokeStyle(2, COLORS.CYAN, 0.4);
    this.tweens.add({
      targets: halo, scaleX: 1.6, scaleY: 1.6, alpha: 0,
      duration: 1600, repeat: -1, ease: 'Sine.easeOut',
    });

    this.add.text(150, cy - 100, 'TON NOYAU', {
      ...FONTS.PRIMARY,
      fontSize: '22px',
      color:    '#00ffff',
      alpha:    0.85,
    }).setOrigin(0.5);
  }

  // ── Noyau ennemi (droite) ─────────────────────
  _createEnemyCore(width, cy) {
    const x    = width - 150;
    const core = this.add.circle(x, cy, 60, COLORS.PINK_ENEMY, 0.15);
    core.setStrokeStyle(4, COLORS.PINK_ENEMY, 1);

    const halo = this.add.circle(x, cy, 60, COLORS.PINK_ENEMY, 0);
    halo.setStrokeStyle(2, COLORS.PINK_ENEMY, 0.4);
    this.tweens.add({
      targets: halo, scaleX: 1.6, scaleY: 1.6, alpha: 0,
      duration: 1600, repeat: -1, ease: 'Sine.easeOut',
    });

    this.add.text(x, cy - 100, 'NOYAU ENNEMI', {
      ...FONTS.PRIMARY,
      fontSize: '22px',
      color:    '#ff00aa',
      alpha:    0.85,
    }).setOrigin(0.5);
  }

  // ── Ligne de séparation centrale ─────────────
  _createDivider(cx, height) {
    const line = this.add.graphics();
    line.lineStyle(1, COLORS.CYAN, 0.15);
    line.lineBetween(cx, 0, cx, height);
  }

  // ── HUD : énergie + timer ─────────────────────
  _createHUD(width, cx) {
    // Énergie
    this._energyText = this.add.text(20, 20, '', {
      ...FONTS.PRIMARY,
      fontSize: '28px',
      color:    '#00ffff',
    });

    // Timer centré
    this._timerText = this.add.text(cx, 30, '', {
      ...FONTS.PRIMARY,
      fontSize: '44px',
      color:    '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, blur: 16, color: '#00ffff', fill: true },
    }).setOrigin(0.5);

    // Barre d'énergie
    const barBg = this.add.rectangle(20, 70, 220, 14, 0x222244).setOrigin(0);
    this._energyBar = this.add.rectangle(20, 70, 0, 14, COLORS.CYAN).setOrigin(0);

    this._refreshHUD();
  }

  // ── Mise à jour du HUD ────────────────────────
  _refreshHUD() {
    const energyInt  = Math.floor(this._energy);
    const minutes    = Math.floor(this._timeLeft / 60);
    const seconds    = Math.floor(this._timeLeft % 60);
    const timeStr    = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const barWidth   = Math.round((this._energy / MAX_ENERGY) * 220);

    this._energyText.setText(`ÉNERGIE : ${energyInt} / ${MAX_ENERGY}`);
    this._timerText.setText(timeStr);
    this._timerText.setColor(this._timeLeft <= 30 ? '#ff4444' : '#ffffff');
    this._energyBar.width = barWidth;
  }

  // ── Boucle principale ─────────────────────────
  update(time, delta) {
    const dt = delta / 1000; // secondes

    this._energy   = Math.min(this._energy + dt * 0.2, MAX_ENERGY);
    this._timeLeft = Math.max(this._timeLeft - dt, 0);

    this._refreshHUD();

    if (this._timeLeft === 0) {
      this._onTimeUp();
    }
  }

  // ── Fin de partie ─────────────────────────────
  _onTimeUp() {
    // Empêche les appels répétés
    this.scene.pause();

    this.cameras.main.fadeOut(600, 10, 0, 31);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // TODO : afficher un écran de résultat ou relancer TitleScene
      this.scene.start('TitleScene');
    });
  }
}
