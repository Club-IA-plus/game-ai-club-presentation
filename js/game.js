// Configuration du jeu Phaser 3 - Plein écran
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

// Redimensionnement dynamique de la fenêtre
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

let player;
let cursors;

function preload() {
    // Créer un sprite simple pour le joueur (carré coloré)
    this.add.graphics()
        .fillStyle(0x3498db)
        .fillRect(0, 0, 32, 32)
        .generateTexture('player', 32, 32);
    
    // Créer un sprite pour la plateforme
    this.add.graphics()
        .fillStyle(0x27ae60)
        .fillRect(0, 0, 400, 32)
        .generateTexture('platform', 400, 32);
}

function create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    // Créer les plateformes (positions proportionnelles à la taille de la fenêtre)
    const platforms = this.physics.add.staticGroup();
    
    // Plateforme principale au sol
    platforms.create(width / 2, height - 32, 'platform').setScale(1).refreshBody();
    
    // Plateformes flottantes (positions adaptatives)
    platforms.create(width * 0.75, height * 0.65, 'platform');
    platforms.create(width * 0.1, height * 0.4, 'platform');
    platforms.create(width * 0.9, height * 0.35, 'platform');
    
    // Créer le joueur
    player = this.physics.add.sprite(width * 0.15, height * 0.75, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Collision entre le joueur et les plateformes
    this.physics.add.collider(player, platforms);
    
    // Contrôles clavier
    cursors = this.input.keyboard.createCursorKeys();
    
    // Instructions
    this.add.text(16, 16, 'Utilisez les flèches pour bouger', {
        fontSize: Math.max(16, width / 50) + 'px',
        fill: '#ffffff'
    });
}

function update() {
    // Mouvement horizontal
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }
    
    // Saut
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

