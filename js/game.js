// Configuration du jeu Phaser 3
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    }
};

const game = new Phaser.Game(config);

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
    // Créer les plateformes
    const platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, 'platform').setScale(1).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 220, 'platform');
    
    // Créer le joueur
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Collision entre le joueur et les plateformes
    this.physics.add.collider(player, platforms);
    
    // Contrôles clavier
    cursors = this.input.keyboard.createCursorKeys();
    
    // Instructions
    this.add.text(16, 16, 'Utilisez les flèches pour bouger', {
        fontSize: '18px',
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

