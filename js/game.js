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

// Définition des niveaux (sessions du Club IA) - 3x plus grands
const levels = [
    {
        name: "Lancement du club IA",
        subtitle: "4 fondateurs : Michael, Laure, Hakim, Yohann",
        date: "Avril 2024",
        startX: 0,
        endX: 3000
    },
    {
        name: "Séance Waouh 1",
        subtitle: "Découverte de chatGPT",
        date: "16 septembre 2024",
        startX: 3000,
        endX: 6000
    },
    {
        name: "Séance Waouh 2",
        subtitle: "Découverte de l'image (Midjourney)",
        date: "23 septembre 2024",
        startX: 6000,
        endX: 9000
    },
    {
        name: "Séance Waouh 3",
        subtitle: "Découverte du code (Cursor)",
        date: "30 septembre 2024",
        startX: 9000,
        endX: 12000
    },
    {
        name: "Séance 4",
        subtitle: "Contexte et Chat GPT",
        date: "07 octobre 2024",
        startX: 12000,
        endX: 15000
    },
    {
        name: "Séance 5 & 6",
        subtitle: "Notebook LM",
        date: "14 octobre et 4 Novembre 2024",
        startX: 15000,
        endX: 18000
    },
    {
        name: "Séance 7",
        subtitle: "Prompt Engineering",
        date: "18 Novembre 2024",
        startX: 18000,
        endX: 21000
    },
    {
        name: "Séance 8",
        subtitle: "Création d'image avec Gemini",
        date: "25 Novembre 2024",
        startX: 21000,
        endX: 24000
    },
    {
        name: "Séance 9",
        subtitle: "De la musique avec Suno",
        date: "2 Décembre 2024",
        startX: 24000,
        endX: 27000
    }
];

let player;
let cursors;
let canJump = true;
let currentLevelIndex = 0;
let levelTitleText;
let levelDateText;
let ground;
let worldWidth;

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
    
    // Calculer la largeur totale du monde (dernier niveau)
    worldWidth = levels[levels.length - 1].endX;
    
    // Créer le fond avec un ciel dégradé (sur toute la largeur du monde)
    this.add.rectangle(0, 0, worldWidth, height, 0x87CEEB).setOrigin(0, 0);
    
    // Ajouter des nuages décoratifs sur toute la largeur du monde
    const clouds = this.add.group();
    const numClouds = Math.floor(worldWidth / 200);
    for (let i = 0; i < numClouds; i++) {
        const x = (worldWidth / numClouds) * i + Math.random() * 100;
        const y = Math.random() * (height * 0.3) + 20;
        const scale = 0.5 + Math.random() * 0.5;
        clouds.create(x, y, 'cloud').setScale(scale).setAlpha(0.8);
    }
    
    // Créer le sol sur toute la largeur du monde
    ground = this.physics.add.staticGroup();
    const groundTiles = Math.ceil(worldWidth / 100) + 1;
    for (let i = 0; i < groundTiles; i++) {
        const tile = ground.create(i * 100, height, 'ground');
        tile.setOrigin(0, 1);
        tile.refreshBody();
    }
    
    // Configurer les limites du monde
    this.physics.world.setBounds(0, 0, worldWidth, height);
    
    // Créer le joueur
    player = this.physics.add.sprite(100, height - 100, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // Collision entre le joueur et le sol
    this.physics.add.collider(player, ground);
    
    // Configurer la caméra pour suivre le joueur
    this.cameras.main.setBounds(0, 0, worldWidth, height);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(width * 0.3, height * 0.3);
    
    // Contrôles clavier
    cursors = this.input.keyboard.createCursorKeys();
    
    // Créer les textes pour afficher le niveau actuel (fixes par rapport à la caméra)
    levelTitleText = this.add.text(0, 0, '', {
        fontSize: '32px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(1000);
    
    levelDateText = this.add.text(0, 0, '', {
        fontSize: '20px',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 3
    }).setScrollFactor(0).setDepth(1000);
    
    // Mettre à jour l'affichage du niveau initial
    updateLevelDisplay(this);
    
    // Créer des marqueurs visuels pour les limites des niveaux
    for (let i = 1; i < levels.length; i++) {
        const levelStartX = levels[i].startX;
        // Créer une ligne verticale pour marquer le début de chaque niveau
        const marker = this.add.graphics();
        marker.lineStyle(4, 0xff0000, 0.6);
        marker.lineBetween(levelStartX, 0, levelStartX, height);
        marker.setDepth(500);
        
        // Ajouter un petit panneau avec le numéro du niveau
        const levelNumber = this.add.text(levelStartX + 10, height - 150, `Niveau ${i + 1}`, {
            fontSize: '16px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 2,
            backgroundColor: '#ffffff',
            padding: { x: 5, y: 2 }
        });
        levelNumber.setOrigin(0, 0);
    }
}

function updateLevelDisplay(scene) {
    const currentLevel = levels[currentLevelIndex];
    const width = scene.scale.width;
    
    // Mettre à jour le titre du niveau
    levelTitleText.setText(currentLevel.name);
    levelTitleText.setPosition(width / 2 - levelTitleText.width / 2, 20);
    
    // Mettre à jour le sous-titre et la date
    const subtitleAndDate = currentLevel.subtitle + '\n' + currentLevel.date;
    levelDateText.setText(subtitleAndDate);
    levelDateText.setPosition(width / 2 - levelDateText.width / 2, 70);
}

function update() {
    // Vérifier si le joueur est au sol pour permettre le saut
    if (player.body.touching.down) {
        canJump = true;
    }
    
    // Mouvement horizontal (vitesse 3x plus rapide)
    if (cursors.left.isDown) {
        player.setVelocityX(-1200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(1200);
    } else {
        player.setVelocityX(0);
    }
    
    // Saut amélioré - permet de sauter quand on est au sol
    if (cursors.up.isDown && canJump && player.body.touching.down) {
        player.setVelocityY(-400);
        canJump = false;
    }
    
    // Vérifier si le joueur entre dans un nouveau niveau
    const playerX = player.x;
    
    // Vérifier si on avance vers un niveau suivant
    if (currentLevelIndex < levels.length - 1) {
        const nextLevel = levels[currentLevelIndex + 1];
        if (playerX >= nextLevel.startX) {
            currentLevelIndex++;
            updateLevelDisplay(this);
        }
    }
    
    // Vérifier si on recule vers un niveau précédent
    if (currentLevelIndex > 0) {
        const currentLevel = levels[currentLevelIndex];
        if (playerX < currentLevel.startX) {
            currentLevelIndex--;
            updateLevelDisplay(this);
        }
    }
}

