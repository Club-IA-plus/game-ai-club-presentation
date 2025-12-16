import { levels } from './config.js';
import { GameState } from './gameState.js';

// Référence à AudioState pour accéder à la musique actuelle
// On va utiliser une approche différente : accéder directement via la scène

// Filtres audio pour Suno (représentant différents effets sonores)
const sunoAudioFilters = [
    {
        name: "Original",
        description: "Son original sans modification",
        color: 0xFFFFFF, // Blanc
        volume: 0.6,
        rate: 1.0,
        detune: 0,
        pan: 0
    },
    {
        name: "Bass Boost",
        description: "Renforcement des basses",
        color: 0x1E88E5, // Bleu
        volume: 0.7,
        rate: 0.95, // Légèrement ralenti pour plus de profondeur
        detune: -100, // Basses plus présentes
        pan: 0
    },
    {
        name: "High Pass",
        description: "Filtre passe-haut (atténue les basses)",
        color: 0x9C27B0, // Violet
        volume: 0.6,
        rate: 1.0,
        detune: 300, // Augmente les aigus
        pan: 0
    },
    {
        name: "High Pitch",
        description: "Hauteur augmentée",
        color: 0xFFEB3B, // Jaune
        volume: 0.6,
        rate: 1.2, // Plus rapide
        detune: 500, // Plus aigu
        pan: 0
    },
    {
        name: "Low Pitch",
        description: "Hauteur diminuée",
        color: 0x4CAF50, // Vert
        volume: 0.6,
        rate: 0.8, // Plus lent
        detune: -500, // Plus grave
        pan: 0
    },
    {
        name: "Stereo Left",
        description: "Son orienté à gauche",
        color: 0xFF5722, // Orange
        volume: 0.6,
        rate: 1.0,
        detune: 0,
        pan: -1 // Complètement à gauche
    },
    {
        name: "Stereo Right",
        description: "Son orienté à droite",
        color: 0x00BCD4, // Cyan
        volume: 0.6,
        rate: 1.0,
        detune: 0,
        pan: 1 // Complètement à droite
    },
    {
        name: "Low Pass",
        description: "Filtre passe-bas (atténue les aigus)",
        color: 0x757575, // Gris
        volume: 0.6,
        rate: 0.9, // Légèrement ralenti
        detune: -300, // Augmente les basses
        pan: 0
    }
];

// Création des plateformes avec filtres audio pour le niveau 9
export function createLevel9Platforms(scene, width, height) {
    // Niveau 9 : Séance 9 - De la musique avec Suno
    const level9 = levels[8]; // Index 8 pour le niveau 9
    const level9StartX = level9.startX;
    const level9EndX = level9.endX;
    const level9Width = level9EndX - level9StartX;
    
    // Créer un groupe de plateformes pour ce niveau
    if (!GameState.level9Platforms) {
        GameState.level9Platforms = scene.physics.add.staticGroup();
    }
    GameState.level9PlatformData = [];
    GameState.lastLevel9PlatformIndex = -1;
    
    // Créer des plateformes
    const numPlatforms = sunoAudioFilters.length;
    const platformWidth = 200;
    const spacingBetweenPlatforms = 200; // Rapprochées
    const totalPlatformsWidth = (numPlatforms * platformWidth) + ((numPlatforms - 1) * spacingBetweenPlatforms);
    const startX = level9StartX + (level9Width - totalPlatformsWidth) / 2;
    const baseY = height - 200;
    
    for (let i = 0; i < numPlatforms; i++) {
        const platformX = startX + (i * (platformWidth + spacingBetweenPlatforms)) + platformWidth / 2;
        const platformY = baseY;
        
        // Créer la plateforme
        const platform = GameState.level9Platforms.create(platformX, platformY, 'platform');
        platform.setScale(1, 1).refreshBody();
        platform.setDepth(10);
        
        // Nom du filtre sur la plateforme
        const filterNameText = scene.add.text(platformX, platformY - 15, sunoAudioFilters[i].name, {
            fontSize: '14px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 6, y: 3 }
        });
        filterNameText.setOrigin(0.5, 0.5);
        filterNameText.setDepth(11);
        
        // Stocker les données de la plateforme
        GameState.level9PlatformData.push({
            platformIndex: i,
            platformX: platformX,
            platformY: platformY,
            platform: platform,
            filter: sunoAudioFilters[i],
            filterNameText: filterNameText
        });
    }
    
    // Collision entre le joueur et les plateformes
    if (GameState.player && GameState.level9Platforms) {
        scene.physics.add.collider(GameState.player, GameState.level9Platforms);
    }
}

// Appliquer un filtre audio sur la musique du niveau 9
function applyAudioFilter(scene, filter) {
    // Récupérer la musique actuelle du niveau 9
    const musicKey = 'musicLevel9';
    
    // Chercher toutes les instances de son avec cette clé
    const sounds = scene.sound.getAll(musicKey);
    let currentMusic = null;
    
    // Trouver la musique en cours de lecture
    if (sounds && sounds.length > 0) {
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i] && sounds[i].isPlaying) {
                currentMusic = sounds[i];
                break;
            }
        }
    }
    
    // Si pas trouvé, essayer de récupérer directement via la scène
    if (!currentMusic) {
        // Essayer de récupérer via getAll ou get
        const allSounds = scene.sound.sounds;
        if (allSounds) {
            for (let i = 0; i < allSounds.length; i++) {
                if (allSounds[i] && allSounds[i].key === musicKey && allSounds[i].isPlaying) {
                    currentMusic = allSounds[i];
                    break;
                }
            }
        }
    }
    
    if (!currentMusic || !currentMusic.isPlaying) {
        console.log('Musique du niveau 9 non trouvée ou non en cours de lecture');
        return; // Pas de musique en cours
    }
    
    // Arrêter toutes les animations de transition en cours
    if (GameState.level9AudioTween) {
        GameState.level9AudioTween.stop();
    }
    
    // Appliquer les paramètres audio avec une transition douce
    if (filter.volume !== undefined) {
        const volumeObj = { value: currentMusic.volume };
        GameState.level9AudioTween = scene.tweens.add({
            targets: volumeObj,
            value: filter.volume,
            duration: 500,
            ease: 'Power2',
            onUpdate: function() {
                if (currentMusic && currentMusic.setVolume) {
                    currentMusic.setVolume(volumeObj.value);
                }
            }
        });
    }
    
    // Appliquer le rate (vitesse de lecture)
    if (filter.rate !== undefined && currentMusic.setRate) {
        currentMusic.setRate(filter.rate);
    }
    
    // Appliquer le detune (hauteur)
    if (filter.detune !== undefined && currentMusic.setDetune) {
        currentMusic.setDetune(filter.detune);
    }
    
    // Appliquer le pan (stéréo)
    if (filter.pan !== undefined && currentMusic.setPan) {
        currentMusic.setPan(filter.pan);
    }
    
    GameState.currentAudioFilter = filter; // Mettre à jour le filtre actuel
}

// Réinitialiser le filtre audio à l'original
function resetAudioFilter(scene) {
    const originalFilter = sunoAudioFilters[0]; // Premier filtre = Original
    applyAudioFilter(scene, originalFilter);
    GameState.currentAudioFilter = null;
}

// Gérer les interactions avec les plateformes du niveau 9
export function handleLevel9Platforms(scene) {
    try {
        // Vérifier si on est sur le niveau 9
        if (GameState.currentLevelIndex !== 8) {
            // Réinitialiser le filtre si on quitte le niveau 9
            if (GameState.currentAudioFilter) {
                resetAudioFilter(scene);
            }
            return;
        }
        
        // S'assurer que les plateformes sont créées
        if (!GameState.level9Platforms || GameState.level9PlatformData.length === 0) {
            createLevel9Platforms(scene, scene.scale.width, scene.scale.height);
        }
        
        // Vérifier si le joueur est sur une plateforme
        if (!GameState.player) {
            return;
        }
        
        const playerX = GameState.player.x;
        const playerY = GameState.player.y;
        const playerWidth = GameState.player.width;
        const playerHeight = GameState.player.height;
        
        // Trouver sur quelle plateforme le joueur est
        let currentPlatformIndex = -1;
        GameState.level9PlatformData.forEach((data, index) => {
            const { platformX, platformY } = data;
            const platformWidth = 200; // Largeur de la plateforme
            const platformHeight = 24; // Hauteur de la plateforme
            
            // Vérifier si le joueur est sur la plateforme (comme dans level3)
            const isOnPlatform = GameState.player.body.touching.down &&
                                 playerY + playerHeight / 2 <= platformY + platformHeight / 2 + 10 &&
                                 playerY + playerHeight / 2 >= platformY - platformHeight / 2 - 10 &&
                                 playerX >= platformX - platformWidth / 2 &&
                                 playerX <= platformX + platformWidth / 2;
            
            if (isOnPlatform) {
                currentPlatformIndex = index;
            }
        });
        
        // Appliquer le filtre si on est sur une plateforme
        if (currentPlatformIndex !== -1 && currentPlatformIndex !== GameState.lastLevel9PlatformIndex) {
            const platformData = GameState.level9PlatformData[currentPlatformIndex];
            const filter = platformData.filter;
            
            // Appliquer le filtre audio
            applyAudioFilter(scene, filter);
            
            // Afficher une bulle d'information
            showLevel9InfoBubble(scene, platformData);
            
            GameState.lastLevel9PlatformIndex = currentPlatformIndex;
            
            // Réinitialiser le timer de reset
            if (GameState.level9FilterResetTimer) {
                GameState.level9FilterResetTimer.remove();
            }
        } else if (currentPlatformIndex === -1 && GameState.lastLevel9PlatformIndex !== -1) {
            // Le joueur a quitté la plateforme, réinitialiser après un délai
            if (GameState.level9FilterResetTimer) {
                GameState.level9FilterResetTimer.remove();
            }
            
            GameState.level9FilterResetTimer = scene.time.delayedCall(300, () => {
                resetAudioFilter(scene);
                GameState.lastLevel9PlatformIndex = -1;
                hideLevel9InfoBubble(scene);
            });
        }
    } catch (error) {
        console.error('Erreur dans handleLevel9Platforms:', error);
    }
}

// Afficher une bulle d'information pour le filtre audio
function showLevel9InfoBubble(scene, platformData) {
    // Supprimer la bulle précédente si elle existe
    hideLevel9InfoBubble(scene);
    
    const filter = platformData.filter;
    const platformX = platformData.platformX;
    const platformY = platformData.platformY;
    
    // Créer une bulle d'information
    const bubbleWidth = 250;
    const bubbleHeight = 80;
    const bubbleX = platformX;
    const bubbleY = platformY - 100;
    
    const bubble = scene.add.graphics();
    bubble.fillStyle(0x000000, 0.85);
    bubble.fillRoundedRect(bubbleX - bubbleWidth / 2, bubbleY - bubbleHeight / 2, bubbleWidth, bubbleHeight, 10);
    bubble.setDepth(2500);
    
    const titleText = scene.add.text(bubbleX, bubbleY - 20, filter.name, {
        fontSize: '16px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    titleText.setOrigin(0.5, 0.5);
    titleText.setDepth(2501);
    
    const descText = scene.add.text(bubbleX, bubbleY + 10, filter.description, {
        fontSize: '12px',
        fill: '#CCCCCC',
        align: 'center',
        wordWrap: { width: bubbleWidth - 20 }
    });
    descText.setOrigin(0.5, 0.5);
    descText.setDepth(2501);
    
    GameState.level9InfoBubble = {
        bubble: bubble,
        titleText: titleText,
        descText: descText
    };
}

// Masquer la bulle d'information
function hideLevel9InfoBubble(scene) {
    if (GameState.level9InfoBubble) {
        if (GameState.level9InfoBubble.bubble) {
            GameState.level9InfoBubble.bubble.destroy();
        }
        if (GameState.level9InfoBubble.titleText) {
            GameState.level9InfoBubble.titleText.destroy();
        }
        if (GameState.level9InfoBubble.descText) {
            GameState.level9InfoBubble.descText.destroy();
        }
        GameState.level9InfoBubble = null;
    }
}

