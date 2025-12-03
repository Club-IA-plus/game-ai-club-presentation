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
    // Créer un sprite de personnage apprenant avec un ordinateur portable (2x plus grand)
    const graphics = this.add.graphics();
    
    // Tête (ovale plus réaliste) - 2x
    graphics.fillStyle(0xFFDBAC); // Couleur peau
    graphics.fillEllipse(32, 22, 20, 22); // Tête ovale au lieu de cercle
    
    // Ombres sur le visage pour plus de réalisme
    graphics.fillStyle(0xF4C2A1); // Couleur peau plus foncée pour les ombres
    graphics.fillEllipse(28, 24, 6, 8); // Ombre sur la joue gauche
    graphics.fillEllipse(36, 24, 6, 8); // Ombre sur la joue droite
    
    // Cheveux (style moderne avec plus de texture) - 2x (brun)
    graphics.fillStyle(0x8B4513); // Brun selle
    graphics.fillEllipse(32, 10, 22, 18); // Cheveux en forme ovale
    graphics.fillRect(12, 10, 40, 10);
    // Mèches de cheveux pour plus de réalisme
    graphics.fillStyle(0x654321); // Brun plus foncé pour les ombres
    graphics.fillEllipse(26, 12, 4, 6);
    graphics.fillEllipse(38, 12, 4, 6);
    
    // Yeux plus réalistes - 2x
    // Blanc des yeux
    graphics.fillStyle(0xFFFFFF);
    graphics.fillEllipse(26, 18, 6, 5);
    graphics.fillEllipse(38, 18, 6, 5);
    
    // Iris (bleu)
    graphics.fillStyle(0x4A90E2);
    graphics.fillCircle(26, 18, 2.5);
    graphics.fillCircle(38, 18, 2.5);
    
    // Pupilles
    graphics.fillStyle(0x000000);
    graphics.fillCircle(26, 18, 1.5);
    graphics.fillCircle(38, 18, 1.5);
    
    // Reflet dans les yeux (pour plus de vie)
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(27, 17, 0.8);
    graphics.fillCircle(39, 17, 0.8);
    
    // Sourcils
    graphics.fillStyle(0x654321); // Brun foncé
    graphics.fillRoundedRect(22, 15, 8, 2, 1);
    graphics.fillRoundedRect(34, 15, 8, 2, 1);
    
    // Nez (plus réaliste)
    graphics.fillStyle(0xE8C4A0); // Couleur peau légèrement plus foncée
    graphics.fillEllipse(32, 22, 3, 4);
    // Narines
    graphics.fillStyle(0xD4A574);
    graphics.fillCircle(31, 24, 0.8);
    graphics.fillCircle(33, 24, 0.8);
    
    // Bouche avec sourire plus réaliste - 2x
    // Lèvres supérieures
    graphics.fillStyle(0xE8A87C); // Couleur lèvres
    graphics.beginPath();
    graphics.arc(32, 28, 6, 0.2, Math.PI - 0.2, false);
    graphics.closePath();
    graphics.fillPath();
    
    // Bouche ouverte (blanc pour les dents)
    graphics.fillStyle(0xFFFFFF);
    graphics.beginPath();
    graphics.arc(32, 30, 7, 0.3, Math.PI - 0.3, false);
    graphics.lineTo(25, 34);
    graphics.arc(32, 30, 7, Math.PI - 0.3, 0.3, true);
    graphics.closePath();
    graphics.fillPath();
    
    // Contour des lèvres
    graphics.lineStyle(1.5, 0xD4A574);
    graphics.arc(32, 30, 7, 0.3, Math.PI - 0.3, false);
    
    // Corps du personnage (rectangle arrondi - t-shirt) - 2x
    graphics.fillStyle(0x3498DB); // Bleu vif pour le t-shirt
    graphics.fillRoundedRect(12, 36, 40, 36, 6);
    
    // Ordinateur portable (tenu devant - élément central) - 2x
    graphics.fillStyle(0x2C3E50); // Gris foncé pour l'écran fermé
    graphics.fillRoundedRect(4, 60, 56, 36, 4);
    
    // Écran de l'ordinateur (ouvert, allumé) - 2x
    graphics.fillStyle(0x1ABC9C); // Turquoise pour l'écran actif
    graphics.fillRoundedRect(8, 64, 48, 24, 2);
    
    // Clavier (ligne en bas de l'écran) - 2x
    graphics.fillStyle(0x34495E);
    graphics.fillRect(12, 84, 40, 4);
    
    // Icône IA sur l'écran (cercles connectés représentant un réseau) - 2x
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(20, 72, 4);
    graphics.fillCircle(32, 72, 4);
    graphics.fillCircle(44, 72, 4);
    graphics.lineStyle(2, 0xFFFFFF);
    graphics.lineBetween(20, 72, 32, 72);
    graphics.lineBetween(32, 72, 44, 72);
    
    // Bras tenant l'ordinateur - 2x
    graphics.fillStyle(0xFFDBAC); // Couleur peau pour les bras
    graphics.fillRect(0, 40, 8, 24);
    graphics.fillRect(56, 40, 8, 24);
    
    graphics.generateTexture('player', 64, 100);
    
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
    
    // Configurer les limites du monde (avec un peu de marge pour éviter les blocages)
    this.physics.world.setBounds(0, 0, worldWidth, height);
    
    // Créer le joueur (position initiale ajustée - plus haut pour éviter le blocage)
    player = this.physics.add.sprite(100, height - 180, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true); // Collision avec toutes les limites
    
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
    const isOnGround = player.body.touching.down || (player.body.velocity.y === 0 && player.body.blocked.down);
    if (isOnGround) {
        canJump = true;
    }
    
    // Mouvement horizontal (vitesse 3x plus rapide)
    // Empêcher le mouvement si on est bloqué contre un mur
    if (cursors.left.isDown && !player.body.blocked.left) {
        player.setVelocityX(-1200);
    } else if (cursors.right.isDown && !player.body.blocked.right) {
        player.setVelocityX(1200);
    } else {
        player.setVelocityX(0);
    }
    
    // Saut amélioré - permet de sauter quand on est au sol
    if (cursors.up.isDown && canJump && isOnGround) {
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

