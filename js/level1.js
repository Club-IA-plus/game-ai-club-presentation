import { levels } from './config.js';
import { GameState } from './gameState.js';

// Informations sur les 4 fondateurs
const foundersData = [
    {
        name: "Michael",
        role: "Fondateur & Visionnaire & Pédagogue",
        quote: "L'IA est l'outil qui va transformer notre façon d'apprendre et de créer.",
        color: 0x3498DB // Bleu
    },
    {
        name: "Laure",
        role: "Fondatrice et pédagogue, spécialiste de l’éthique de l’IA",
        quote: "Partager nos découvertes pour que chacun puisse s'approprier l'IA.",
        color: 0xF39C12 // Orange
    },
    {
        name: "Hakim",
        role: "Fondateur & Créatif",
        quote: "L'innovation naît de la curiosité et de l'expérimentation collective.",
        color: 0x2ECC71 // Vert
    },
    {
        name: "Yohann",
        role: "Fondateur & Technicien",
        quote: "L'IA ouvre des possibilités infinies pour la création.",
        color: 0xF39C12 // Orange
    }
];

// Création des plateformes avec portraits pour le niveau 1
export function createLevel1Platforms(scene, width, height) {
    // Niveau 1 : Lancement du club IA
    const level1 = levels[0]; // Index 0 pour le niveau 1
    const level1StartX = level1.startX;
    const level1EndX = level1.endX;
    const level1Width = level1EndX - level1StartX;
    
    // Créer un groupe de plateformes pour ce niveau
    if (!GameState.level1Platforms) {
        GameState.level1Platforms = scene.physics.add.staticGroup();
    }
    GameState.level1PlatformData = [];
    GameState.lastLevel1PlatformIndex = -1;
    
    // Créer 4 plateformes avec portraits des fondateurs
    const numPlatforms = 4;
    const platformWidth = 200;
    const spacingBetweenPlatforms = 500; // Espacement entre les plateformes
    const totalPlatformsWidth = (numPlatforms * platformWidth) + ((numPlatforms - 1) * spacingBetweenPlatforms);
    const startX = level1StartX + (level1Width - totalPlatformsWidth) / 2; // Centrer le groupe de plateformes
    const baseY = height - 200; // Hauteur des plateformes
    
    for (let i = 0; i < numPlatforms; i++) {
        const platformX = startX + (i * (platformWidth + spacingBetweenPlatforms)) + platformWidth / 2;
        const platformY = baseY;
        
        // Créer la plateforme
        const platform = GameState.level1Platforms.create(platformX, platformY, 'platform');
        platform.setScale(1, 1).refreshBody();
        platform.setDepth(10);
        
        // Créer un portrait/panneau au-dessus de la plateforme
        const portraitY = platformY - 100;
        
        // Fond du portrait (rectangle arrondi)
        const portraitBg = scene.add.graphics();
        portraitBg.fillStyle(foundersData[i].color, 0.9);
        portraitBg.fillRoundedRect(platformX - platformWidth / 2, portraitY - 60, platformWidth, 120, 10);
        portraitBg.setDepth(11);
        
        // Bordure du portrait
        portraitBg.lineStyle(3, 0xFFFFFF, 1);
        portraitBg.strokeRoundedRect(platformX - platformWidth / 2, portraitY - 60, platformWidth, 120, 10);
        
        // Icône/avatar (cercle coloré avec initiale)
        const avatarSize = 50;
        const avatarGraphics = scene.add.graphics();
        avatarGraphics.fillStyle(0xFFFFFF, 1);
        avatarGraphics.fillCircle(platformX, portraitY - 20, avatarSize / 2);
        avatarGraphics.lineStyle(3, foundersData[i].color, 1);
        avatarGraphics.strokeCircle(platformX, portraitY - 20, avatarSize / 2);
        avatarGraphics.setDepth(12);
        
        // Initiale du fondateur
        const colorHex = '#' + foundersData[i].color.toString(16).padStart(6, '0');
        const initialText = scene.add.text(platformX, portraitY - 20, foundersData[i].name[0], {
            fontSize: '32px',
            fill: colorHex,
            fontStyle: 'bold'
        });
        initialText.setOrigin(0.5, 0.5);
        initialText.setDepth(13);
        
        // Nom du fondateur
        const nameText = scene.add.text(platformX, portraitY + 20, foundersData[i].name, {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontStyle: 'bold'
        });
        nameText.setOrigin(0.5, 0.5);
        nameText.setDepth(13);
        
        // Stocker les données de la plateforme avec les informations du fondateur
        GameState.level1PlatformData.push({
            index: i,
            platformX: platformX,
            platformY: platformY,
            platformWidth: platformWidth,
            platformHeight: 24,
            founder: foundersData[i],
            portraitBg: portraitBg,
            avatarGraphics: avatarGraphics,
            initialText: initialText,
            nameText: nameText
        });
    }
    
    // Collision entre le joueur et les plateformes (si le joueur existe)
    if (GameState.player && GameState.level1Platforms) {
        scene.physics.add.collider(GameState.player, GameState.level1Platforms);
    }
}

// Gestion des interactions avec les plateformes du niveau 1
export function handleLevel1Platforms(scene) {
    if (!GameState.player || GameState.currentLevelIndex !== 0 || !GameState.level1PlatformData || GameState.level1PlatformData.length === 0) {
        // Si on n'est plus sur le niveau 1, supprimer la bulle
        if (GameState.level1InfoBubble) {
            GameState.level1InfoBubble.destroy();
            GameState.level1InfoBubble = null;
        }
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const playerWidth = GameState.player.width;
    const playerHeight = GameState.player.height;
    
    // Trouver sur quelle plateforme le joueur est
    let currentPlatformIndex = -1;
    GameState.level1PlatformData.forEach((data, index) => {
        const { platformX, platformY, platformWidth, platformHeight } = data;
        
        // Vérifier si le joueur est sur la plateforme (et au sol)
        const isOnPlatform = GameState.player.body.touching.down &&
                             playerY + playerHeight / 2 <= platformY + platformHeight / 2 + 10 &&
                             playerY + playerHeight / 2 >= platformY - platformHeight / 2 - 10 &&
                             playerX >= platformX - platformWidth / 2 &&
                             playerX <= platformX + platformWidth / 2;
        
        if (isOnPlatform) {
            currentPlatformIndex = index;
        }
    });
    
    // Si le joueur est sur une nouvelle plateforme, afficher la bulle d'information
    if (currentPlatformIndex !== -1 && currentPlatformIndex !== GameState.lastLevel1PlatformIndex) {
        // Supprimer l'ancienne bulle si elle existe
        if (GameState.level1InfoBubble) {
            GameState.level1InfoBubble.destroy();
            GameState.level1InfoBubble = null;
        }
        
        // Afficher la bulle d'information
        showFounderInfo(scene, GameState.level1PlatformData[currentPlatformIndex]);
        GameState.lastLevel1PlatformIndex = currentPlatformIndex;
    }
    
    // Si le joueur n'est plus sur une plateforme, supprimer la bulle
    if (currentPlatformIndex === -1 && GameState.lastLevel1PlatformIndex !== -1) {
        if (GameState.level1InfoBubble) {
            GameState.level1InfoBubble.destroy();
            GameState.level1InfoBubble = null;
        }
        GameState.lastLevel1PlatformIndex = -1;
    }
}

// Afficher la bulle d'information d'un fondateur
function showFounderInfo(scene, platformData) {
    const { platformX, platformY, founder } = platformData;
    const bubbleWidth = 450; // Largeur augmentée pour accommoder les textes longs
    const bubbleHeight = 200; // Hauteur augmentée si nécessaire
    
    // Position de la bulle dans le monde
    const bubbleX = platformX;
    const bubbleY = platformY - 200; // Au-dessus de la plateforme
    
    // Créer un conteneur pour la bulle
    const bubbleContainer = scene.add.container(bubbleX, bubbleY);
    bubbleContainer.setDepth(1000);
    bubbleContainer.setScrollFactor(1); // Suit la caméra pour rester au-dessus de la plateforme
    
    // Fond de la bulle (arrondi)
    const bubbleBg = scene.add.graphics();
    bubbleBg.fillStyle(0xFFFFFF, 0.95);
    bubbleBg.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    bubbleBg.lineStyle(4, founder.color, 1);
    bubbleBg.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    bubbleBg.setDepth(1001);
    
    // Nom du fondateur
    const colorHex = '#' + founder.color.toString(16).padStart(6, '0');
    const nameText = scene.add.text(0, -60, founder.name, {
        fontSize: '28px',
        fill: colorHex,
        fontStyle: 'bold'
    });
    nameText.setOrigin(0.5, 0.5);
    nameText.setDepth(1002);
    
    // Rôle du fondateur (avec wordWrap pour éviter le débordement)
    const roleText = scene.add.text(0, -25, founder.role, {
        fontSize: '16px', // Taille réduite légèrement
        fill: '#666666',
        fontStyle: 'italic',
        wordWrap: { width: bubbleWidth - 40 }, // WordWrap pour forcer le retour à la ligne
        align: 'center'
    });
    roleText.setOrigin(0.5, 0.5);
    roleText.setDepth(1002);
    
    // Citation (avec word wrap)
    const quoteText = scene.add.text(0, 20, `"${founder.quote}"`, {
        fontSize: '16px',
        fill: '#333333',
        wordWrap: { width: bubbleWidth - 40 },
        align: 'center'
    });
    quoteText.setOrigin(0.5, 0.5);
    quoteText.setDepth(1002);
    
    // Ajouter tous les éléments au conteneur
    bubbleContainer.add([bubbleBg, nameText, roleText, quoteText]);
    
    // Animation d'apparition
    bubbleContainer.setAlpha(0);
    scene.tweens.add({
        targets: bubbleContainer,
        alpha: 1,
        duration: 300,
        ease: 'Power2'
    });
    
    // Stocker la référence pour pouvoir la supprimer
    GameState.level1InfoBubble = bubbleContainer;
}

