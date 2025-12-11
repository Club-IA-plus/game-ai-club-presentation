import { levels } from './config.js';
import { GameState } from './gameState.js';

// Filtres de couleur pour Midjourney (représentant différents styles/paramètres)
const midjourneyFilters = [
    {
        name: "Style Réaliste",
        description: "Images photoréalistes avec des détails précis",
        color: 0xFFFFFF, // Blanc (pas de filtre, image originale)
        tint: null,
        isGrayscale: false
    },
    {
        name: "Style Noir & Blanc",
        description: "Esthétique classique et intemporelle",
        color: 0x808080, // Gris
        tint: null,
        isGrayscale: true
    },
    {
        name: "Style Bleuté",
        description: "Atmosphère froide et apaisante",
        color: 0x4A90E2, // Bleu
        tint: 0x4A90E2,
        isGrayscale: false
    },
    {
        name: "Style Fushia",
        description: "Couleurs vibrantes et énergiques",
        color: 0xFF1493, // Fushia
        tint: 0xFF1493,
        isGrayscale: false
    },
    {
        name: "Style Doré",
        description: "Lumières chaudes et ambiance dorée",
        color: 0xFFD700, // Or
        tint: 0xFFD700,
        isGrayscale: false
    },
    {
        name: "Style Vert Émeraude",
        description: "Nature et sérénité",
        color: 0x50C878, // Vert émeraude
        tint: 0x50C878,
        isGrayscale: false
    },
    {
        name: "Style Violet",
        description: "Mystère et créativité",
        color: 0x8A2BE2, // Violet
        tint: 0x8A2BE2,
        isGrayscale: false
    }
];

// Création des plateformes avec filtres pour le niveau 3
export function createLevel3Platforms(scene, width, height) {
    // Niveau 3 : Séance Waouh 2 - Découverte de l'image (Midjourney)
    const level3 = levels[2]; // Index 2 pour le niveau 3
    const level3StartX = level3.startX;
    const level3EndX = level3.endX;
    const level3Width = level3EndX - level3StartX;
    
    // Créer un groupe de plateformes pour ce niveau
    if (!GameState.level3Platforms) {
        GameState.level3Platforms = scene.physics.add.staticGroup();
    }
    GameState.level3PlatformData = [];
    GameState.lastLevel3PlatformIndex = -1;
    
    // Créer des plateformes (sans images filtrées au-dessus)
    const numPlatforms = midjourneyFilters.length;
    const platformWidth = 200;
    const spacingBetweenPlatforms = 200; // Rapprochées
    const totalPlatformsWidth = (numPlatforms * platformWidth) + ((numPlatforms - 1) * spacingBetweenPlatforms);
    const startX = level3StartX + (level3Width - totalPlatformsWidth) / 2;
    const baseY = height - 200;
    
    for (let i = 0; i < numPlatforms; i++) {
        const platformX = startX + (i * (platformWidth + spacingBetweenPlatforms)) + platformWidth / 2;
        const platformY = baseY;
        
        // Créer la plateforme
        const platform = GameState.level3Platforms.create(platformX, platformY, 'platform');
        platform.setScale(1, 1).refreshBody();
        platform.setDepth(10);
        
        // Nom du filtre sur la plateforme
        const filterNameText = scene.add.text(platformX, platformY - 15, midjourneyFilters[i].name, {
            fontSize: '14px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        });
        filterNameText.setOrigin(0.5, 0.5);
        filterNameText.setDepth(11);
        
        // Stocker les données de la plateforme
        GameState.level3PlatformData.push({
            index: i,
            platformX: platformX,
            platformY: platformY,
            platformWidth: platformWidth,
            platformHeight: 24,
            filter: midjourneyFilters[i],
            filterNameText: filterNameText
        });
    }
    
    // Collision entre le joueur et les plateformes
    if (GameState.player && GameState.level3Platforms) {
        scene.physics.add.collider(GameState.player, GameState.level3Platforms);
    }
}

// Gestion des interactions avec les plateformes du niveau 3
export function handleLevel3Platforms(scene) {
    if (!GameState.player || GameState.currentLevelIndex !== 2 || !GameState.level3PlatformData || GameState.level3PlatformData.length === 0) {
        // Si on n'est plus sur le niveau 3, supprimer la bulle
        if (GameState.level3InfoBubble) {
            GameState.level3InfoBubble.destroy();
            GameState.level3InfoBubble = null;
        }
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const playerWidth = GameState.player.width;
    const playerHeight = GameState.player.height;
    
    // Trouver sur quelle plateforme le joueur est
    let currentPlatformIndex = -1;
    GameState.level3PlatformData.forEach((data, index) => {
        const { platformX, platformY, platformWidth, platformHeight } = data;
        
        // Vérifier si le joueur est sur la plateforme
        const isOnPlatform = GameState.player.body.touching.down &&
                             playerY + playerHeight / 2 <= platformY + platformHeight / 2 + 10 &&
                             playerY + playerHeight / 2 >= platformY - platformHeight / 2 - 10 &&
                             playerX >= platformX - platformWidth / 2 &&
                             playerX <= platformX + platformWidth / 2;
        
        if (isOnPlatform) {
            currentPlatformIndex = index;
        }
    });
    
    // Si le joueur est sur une nouvelle plateforme, appliquer le filtre et afficher la bulle
    if (currentPlatformIndex !== -1 && currentPlatformIndex !== GameState.lastLevel3PlatformIndex) {
        // Annuler le timer de reset si il existe
        if (GameState.level3FilterResetTimer) {
            GameState.level3FilterResetTimer.remove();
            GameState.level3FilterResetTimer = null;
        }
        
        // Supprimer l'ancienne bulle si elle existe
        if (GameState.level3InfoBubble) {
            GameState.level3InfoBubble.destroy();
            GameState.level3InfoBubble = null;
        }
        
        // Appliquer le filtre sur l'image de fond du niveau
        applyFilterToBackground(scene, GameState.level3PlatformData[currentPlatformIndex].filter);
        
        // Afficher la bulle d'information
        showFilterInfo(scene, GameState.level3PlatformData[currentPlatformIndex]);
        GameState.lastLevel3PlatformIndex = currentPlatformIndex;
    }
    
    // Si le joueur est toujours sur la même plateforme, s'assurer que le filtre est toujours appliqué
    if (currentPlatformIndex !== -1 && currentPlatformIndex === GameState.lastLevel3PlatformIndex) {
        // S'assurer que la bulle est toujours affichée
        if (!GameState.level3InfoBubble) {
            showFilterInfo(scene, GameState.level3PlatformData[currentPlatformIndex]);
        }
        // Annuler le timer de reset si on est toujours sur la plateforme
        if (GameState.level3FilterResetTimer) {
            GameState.level3FilterResetTimer.remove();
            GameState.level3FilterResetTimer = null;
        }
    }
    
    // Si le joueur n'est plus sur une plateforme ET qu'il était sur une plateforme avant
    // Utiliser un timer pour éviter le clignotement (attendre un peu avant de remettre l'original)
    if (currentPlatformIndex === -1 && GameState.lastLevel3PlatformIndex !== -1) {
        // Si le timer n'existe pas encore, le créer
        if (!GameState.level3FilterResetTimer) {
            GameState.level3FilterResetTimer = scene.time.delayedCall(300, () => {
                // Vérifier à nouveau si on est toujours pas sur une plateforme
                let stillOnPlatform = false;
                const playerX = GameState.player.x;
                const playerY = GameState.player.y;
                const playerWidth = GameState.player.width;
                const playerHeight = GameState.player.height;
                
                GameState.level3PlatformData.forEach((data) => {
                    const { platformX, platformY, platformWidth, platformHeight } = data;
                    
                    const isOnPlatform = GameState.player.body.touching.down &&
                                         playerY + playerHeight / 2 <= platformY + platformHeight / 2 + 10 &&
                                         playerY + playerHeight / 2 >= platformY - platformHeight / 2 - 10 &&
                                         playerX >= platformX - platformWidth / 2 &&
                                         playerX <= platformX + platformWidth / 2;
                    
                    if (isOnPlatform) {
                        stillOnPlatform = true;
                    }
                });
                
                // Seulement remettre l'original si on est vraiment sorti
                if (!stillOnPlatform && GameState.currentLevelIndex === 2) {
                    // Remettre l'image originale sans filtre
                    applyFilterToBackground(scene, midjourneyFilters[0]);
                    GameState.lastLevel3PlatformIndex = -1;
                    
                    // Supprimer la bulle
                    if (GameState.level3InfoBubble) {
                        GameState.level3InfoBubble.destroy();
                        GameState.level3InfoBubble = null;
                    }
                }
                
                GameState.level3FilterResetTimer = null;
            });
        }
    }
    
}

// Appliquer un filtre sur l'image de fond du niveau 3
function applyFilterToBackground(scene, filter) {
    if (GameState.level3BackgroundImage) {
        // Vérifier si le filtre est déjà appliqué pour éviter les animations inutiles
        const currentTint = GameState.level3BackgroundImage.tintTopLeft;
        let targetTint;
        
        if (filter.isGrayscale) {
            targetTint = 0x808080;
        } else if (filter.tint) {
            targetTint = filter.tint;
        } else {
            targetTint = 0xFFFFFF;
        }
        
        // Si le filtre est déjà appliqué, ne pas réanimer
        if (currentTint === targetTint && !filter.isGrayscale && filter.tint) {
            return;
        }
        
        // Arrêter toutes les animations en cours sur cette image
        scene.tweens.killTweensOf(GameState.level3BackgroundImage);
        
        // Appliquer le filtre avec une transition fluide
        if (filter.isGrayscale) {
            // Filtre noir et blanc : utiliser un tint gris pour désaturer
            scene.tweens.add({
                targets: GameState.level3BackgroundImage,
                tint: 0x808080,
                alpha: 0.8,
                duration: 500,
                ease: 'Power2'
            });
        } else if (filter.tint) {
            // Filtre de couleur
            scene.tweens.add({
                targets: GameState.level3BackgroundImage,
                tint: filter.tint,
                alpha: 0.8,
                duration: 500,
                ease: 'Power2'
            });
        } else {
            // Image originale sans filtre
            scene.tweens.add({
                targets: GameState.level3BackgroundImage,
                tint: 0xFFFFFF, // Blanc = pas de tint
                alpha: 0.8,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    GameState.level3BackgroundImage.clearTint();
                }
            });
        }
    }
}

// Afficher la bulle d'information sur le filtre
function showFilterInfo(scene, platformData) {
    const { platformX, platformY, filter } = platformData;
    const bubbleWidth = 350;
    const bubbleHeight = 120;
    
    // Position de la bulle dans le monde
    const bubbleX = platformX;
    const bubbleY = platformY - 120; // Au-dessus de la plateforme
    
    // Créer un conteneur pour la bulle
    const bubbleContainer = scene.add.container(bubbleX, bubbleY);
    bubbleContainer.setDepth(1000);
    bubbleContainer.setScrollFactor(1);
    
    // Fond de la bulle
    const bubbleBg = scene.add.graphics();
    bubbleBg.fillStyle(0x000000, 0.9);
    bubbleBg.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    bubbleBg.lineStyle(3, filter.color || 0xFFFFFF, 1);
    bubbleBg.strokeRoundedRect(-bubbleWidth / 2, -bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    bubbleBg.setDepth(1001);
    
    // Nom du filtre
    const nameText = scene.add.text(0, -35, filter.name, {
        fontSize: '22px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    nameText.setOrigin(0.5, 0.5);
    nameText.setDepth(1002);
    
    // Description
    const descText = scene.add.text(0, 10, filter.description, {
        fontSize: '16px',
        fill: '#CCCCCC',
        wordWrap: { width: bubbleWidth - 40 },
        align: 'center'
    });
    descText.setOrigin(0.5, 0.5);
    descText.setDepth(1002);
    
    // Ajouter tous les éléments au conteneur
    bubbleContainer.add([bubbleBg, nameText, descText]);
    
    // Animation d'apparition
    bubbleContainer.setAlpha(0);
    scene.tweens.add({
        targets: bubbleContainer,
        alpha: 1,
        duration: 300,
        ease: 'Power2'
    });
    
    // Stocker la référence
    GameState.level3InfoBubble = bubbleContainer;
}

