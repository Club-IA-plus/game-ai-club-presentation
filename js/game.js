// Configuration du jeu Phaser 3 - Plein écran
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
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
let canJump = true;

function preload() {
    // Créer un sprite simple pour le joueur (carré coloré)
    this.add.graphics()
        .fillStyle(0x3498db)
        .fillRect(0, 0, 32, 32)
        .generateTexture('player', 32, 32);
    
    // Créer un sprite pour le sol (herbe)
    this.add.graphics()
        .fillStyle(0x27ae60)
        .fillRect(0, 0, 100, 64)
        .fillStyle(0x2ecc71)
        .fillRect(0, 0, 100, 32)
        .generateTexture('ground', 100, 64);
    
    // Créer des nuages
    this.add.graphics()
        .fillStyle(0xffffff)
        .fillCircle(20, 20, 15)
        .fillCircle(35, 20, 18)
        .fillCircle(50, 20, 15)
        .generateTexture('cloud', 70, 40);
}

function create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    // Créer le fond avec un ciel dégradé
    this.add.rectangle(0, 0, width, height, 0x87CEEB).setOrigin(0, 0);
    
    // Ajouter des nuages décoratifs
    const clouds = this.add.group();
    const numClouds = Math.floor(width / 200);
    for (let i = 0; i < numClouds; i++) {
        const x = (width / numClouds) * i + Math.random() * 100;
        const y = Math.random() * (height * 0.3) + 20;
        const scale = 0.5 + Math.random() * 0.5;
        clouds.create(x, y, 'cloud').setScale(scale).setAlpha(0.8);
    }
    
    // Créer le sol qui prend toute la largeur
    const ground = this.physics.add.staticGroup();
    const groundTiles = Math.ceil(width / 100) + 1;
    for (let i = 0; i < groundTiles; i++) {
        const tile = ground.create(i * 100, height, 'ground');
        tile.setOrigin(0, 1);
        tile.refreshBody();
    }
    
    // Créer le joueur
    player = this.physics.add.sprite(width * 0.15, height - 100, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Collision entre le joueur et le sol
    this.physics.add.collider(player, ground);
    
    // Contrôles clavier
    cursors = this.input.keyboard.createCursorKeys();
    
    // Instructions
    this.add.text(16, 16, 'Utilisez les flèches pour bouger et sauter', {
        fontSize: Math.max(16, width / 50) + 'px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
    });
}

function update() {
    // Vérifier si le joueur est au sol pour permettre le saut
    if (player.body.touching.down) {
        canJump = true;
    }
    
    // Mouvement horizontal
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }
    
    // Saut amélioré - permet de sauter quand on est au sol
    if (cursors.up.isDown && canJump && player.body.touching.down) {
        player.setVelocityY(-400);
        canJump = false;
    }
}

