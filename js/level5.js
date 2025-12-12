import { levels } from './config.js';
import { GameState } from './gameState.js';

// Positions des 10 clés dans le niveau 5 (X, Y, avec plateforme d'accès)
// Les hauteurs sont calculées depuis le haut de l'écran (0 = haut, height = bas)
const keyPositions = [
    { x: 12200, y: 500, hasPlatform: true },   // Clé 1 - accessible depuis le sol
    { x: 12700, y: 450, hasPlatform: true },   // Clé 2 - accessible depuis clé 1
    { x: 13200, y: 400, hasPlatform: true },   // Clé 3 - accessible depuis clé 2
    { x: 13700, y: 450, hasPlatform: true },   // Clé 4 - accessible depuis clé 3
    { x: 14200, y: 500, hasPlatform: true },   // Clé 5 - accessible depuis clé 4
    { x: 12400, y: 650, hasPlatform: false },  // Clé 6 - au sol
    { x: 12900, y: 600, hasPlatform: false },  // Clé 7 - au sol
    { x: 13400, y: 650, hasPlatform: false },   // Clé 8 - au sol
    { x: 13900, y: 600, hasPlatform: false },   // Clé 9 - au sol
    { x: 14400, y: 650, hasPlatform: false }    // Clé 10 - au sol
];

// Variable pour stocker le collider (créé une seule fois)
let level5Collider = null;
let level5KeyCollider = null;

// Création des clés et plateformes d'accès pour le niveau 5
export function createLevel5Platforms(scene, width, height) {
    try {
        const level5 = levels[4]; // Index 4 pour le niveau 5
        const level5StartX = level5.startX;
        const level5EndX = level5.endX;
        
        // Ne créer les éléments que si on est sur le niveau 5
        if (GameState.currentLevelIndex !== 4) {
            return;
        }
        
        // Réinitialiser l'état seulement si les éléments existent déjà
        if (GameState.level5Platforms) {
            resetLevel5();
        }
        
        // Créer un groupe de plateformes pour ce niveau
        GameState.level5Platforms = scene.physics.add.staticGroup();
        
        // Ne pas créer de groupe de physique pour les clés
        // On utilisera uniquement la vérification manuelle via keyData
        GameState.level5Keys = null;
        
        // Réinitialiser les données
        GameState.level5KeyData = [];
        GameState.collectedKeys = []; // Clés collectées
        
        // Créer l'affichage du contexte collecté (en dessous du menu)
        createContextDisplay(scene, height);
        
        // Créer des plateformes de progression pour permettre de sauter entre elles
        // Ces plateformes créent un chemin progressif à travers le niveau
        const platformSpacing = 350; // Espacement entre les plateformes (accessible avec un saut)
        const basePlatformY = height - 120; // Hauteur de base des plateformes (près du sol, accessible)
        const maxJumpHeight = 400; // Hauteur maximale accessible avec un saut depuis une plateforme
        
        // Créer des plateformes de progression pour créer un chemin continu
        // Positionner les plateformes pour qu'elles soient toutes accessibles
        const progressionPlatforms = [
            { x: level5StartX + 150, y: basePlatformY },      // Plateforme 1 - près du sol
            { x: level5StartX + 500, y: basePlatformY - 100 }, // Plateforme 2 - légèrement plus haute
            { x: level5StartX + 850, y: basePlatformY - 80 }, // Plateforme 3
            { x: level5StartX + 1200, y: basePlatformY - 120 }, // Plateforme 4
            { x: level5StartX + 1550, y: basePlatformY - 100 }, // Plateforme 5
            { x: level5StartX + 1900, y: basePlatformY - 80 }, // Plateforme 6
            { x: level5StartX + 2250, y: basePlatformY - 100 }, // Plateforme 7
            { x: level5StartX + 2600, y: basePlatformY - 80 }, // Plateforme 8
            { x: level5StartX + 2950, y: basePlatformY }      // Plateforme 9 - retour au niveau du sol
        ];
        
        progressionPlatforms.forEach(platformPos => {
            const platform = GameState.level5Platforms.create(platformPos.x, platformPos.y, 'platform');
            platform.setScale(0.8, 1).refreshBody();
            platform.setDepth(10);
        });
        
        // Créer les plateformes d'accès pour les clés en hauteur et les clés
        keyPositions.forEach((keyPos, index) => {
            // Créer une plateforme d'accès si nécessaire
            if (keyPos.hasPlatform) {
                const platformX = keyPos.x;
                // La plateforme doit être accessible depuis le sol ou d'autres plateformes
                // Positionner la plateforme à une hauteur accessible (max 400px depuis le sol)
                const accessibleY = height - 120; // Hauteur accessible depuis le sol
                const platformY = Math.min(keyPos.y + 50, accessibleY);
                
                const platform = GameState.level5Platforms.create(platformX, platformY, 'platform');
                platform.setScale(0.8, 1).refreshBody();
                platform.setDepth(10);
            }
            
            // Créer la clé (ajuster la hauteur pour qu'elle soit accessible depuis sa plateforme)
            // La clé doit être à moins de 400px au-dessus de sa plateforme ou du sol
            let keyY = keyPos.y;
            if (keyPos.hasPlatform) {
                // Si la clé a une plateforme, elle doit être accessible depuis cette plateforme
                const platformY = Math.min(keyPos.y + 50, height - 120);
                keyY = Math.min(keyPos.y, platformY - 50); // Clé 50px au-dessus de la plateforme
            } else {
                // Si la clé est au sol, la positionner près du sol
                keyY = height - 100;
            }
            createKey(scene, keyPos.x, keyY, index);
        });
        
        // Créer la barrière invisible à la fin du niveau 5
        createLevel5Barrier(scene, level5EndX, height);
        
        // Les colliders seront créés dans handleLevel5Platforms quand le joueur sera disponible
    } catch (error) {
        console.error('Erreur dans createLevel5Platforms:', error);
    }
}

// Créer une clé
function createKey(scene, x, y, index) {
    // Créer un sprite de clé (on utilise un cercle coloré pour représenter la clé)
    const key = scene.add.circle(x, y, 20, 0xFFD700); // Or
    key.setStrokeStyle(3, 0xFFA500);
    key.setDepth(12);
    
    // Ajouter un effet de brillance (rotation)
    scene.tweens.add({
        targets: key,
        scale: 1.2,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
    
    // Ajouter un effet de rotation
    scene.tweens.add({
        targets: key,
        angle: 360,
        duration: 2000,
        repeat: -1,
        ease: 'Linear'
    });
    
    // Ajouter la physique à la clé
    scene.physics.add.existing(key, true); // true = static body
    
    // Configurer le body pour qu'il corresponde à la taille du cercle
    if (key.body) {
        key.body.setCircle(25); // Définir le rayon du cercle de collision (légèrement plus grand pour faciliter la détection)
        key.body.setOffset(0, 0); // Pas d'offset
        // Note: Les static bodies sont déjà immobiles par défaut, pas besoin de setImmovable
    }
    
    // Ajouter au groupe de clés AVANT de stocker dans keyData
    // Note: On n'ajoute pas directement au groupe de physique, on utilise juste le groupe pour le collider
    // Les clés sont gérées individuellement via keyData
    console.log('Clé créée à la position:', x, y);
    
    // Stocker les données de la clé
    GameState.level5KeyData.push({
        keyIndex: index,
        keyX: x,
        keyY: y,
        key: key,
        isCollected: false
    });
    
    console.log(`Clé ${index} créée à (${x}, ${y})`);
}

// Créer la barrière invisible à la fin du niveau 5
function createLevel5Barrier(scene, barrierX, height) {
    // Créer une barrière invisible qui bloque le passage
    if (GameState.level5Barrier) {
        GameState.level5Barrier.destroy();
    }
    
    GameState.level5Barrier = scene.add.rectangle(barrierX, height / 2, 50, height, 0xFF0000, 0.3);
    GameState.level5Barrier.setDepth(100);
    scene.physics.add.existing(GameState.level5Barrier, true);
}

// Afficher un message si le joueur essaie de passer sans toutes les clés
function showBarrierMessage(scene, x, y) {
    // Supprimer le message précédent s'il existe
    if (GameState.level5BarrierMessage) {
        GameState.level5BarrierMessage.destroy();
    }
    
    const message = scene.add.text(x, y - 100, `Vous devez collecter\nles 10 clés pour continuer !\n(${GameState.collectedKeys.length}/10)`, {
        fontSize: '24px',
        fill: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });
    message.setOrigin(0.5, 0.5);
    message.setDepth(2500);
    
    GameState.level5BarrierMessage = message;
    
    // Faire disparaître après 3 secondes
    scene.time.delayedCall(3000, () => {
        if (GameState.level5BarrierMessage) {
            scene.tweens.add({
                targets: message,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    message.destroy();
                    GameState.level5BarrierMessage = null;
                }
            });
        }
    });
}

// Collecter une clé
function collectKey(player, key) {
    const scene = player.scene;
    
    // Debug : vérifier que la fonction est appelée
    console.log('🔑 collectKey appelée pour la clé:', key);
    
    // Trouver la clé dans les données
    let keyData = GameState.level5KeyData.find(data => data.key === key);
    
    if (!keyData) {
        console.log('❌ Clé non trouvée dans keyData, recherche par position...');
        // Essayer de trouver par position si la référence ne fonctionne pas
        const playerX = player.x;
        const playerY = player.y;
        const nearbyKey = GameState.level5KeyData.find(data => {
            if (data.isCollected || !data.key) return false;
            const distance = Math.sqrt(
                Math.pow(playerX - data.keyX, 2) + Math.pow(playerY - data.keyY, 2)
            );
            return distance < 60;
        });
        
        if (nearbyKey && !nearbyKey.isCollected) {
            console.log('✅ Clé trouvée par position alternative');
            keyData = nearbyKey;
        } else {
            console.log('❌ Aucune clé proche trouvée');
            return;
        }
    }
    
    if (keyData.isCollected) {
        console.log('⚠️ Clé déjà collectée');
        return;
    }
    
    console.log('✅ Collecte de la clé', keyData.keyIndex, 'réussie !');
    
    // Marquer comme collectée
    keyData.isCollected = true;
    GameState.collectedKeys.push(keyData.keyIndex);
    
    console.log('📊 Clés collectées:', GameState.collectedKeys.length, '/10');
    
    // Animation de collecte
    scene.tweens.add({
        targets: key,
        scale: 2,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            key.destroy();
        }
    });
    
    // Effet de particules
    createKeyParticles(scene, keyData.keyX, keyData.keyY);
    
    // Mettre à jour l'affichage
    updateContextDisplay(scene);
    
    // Si toutes les clés sont collectées, retirer la barrière
    if (GameState.collectedKeys.length >= 10) {
        removeBarrier(scene);
    }
}

// Retirer la barrière quand toutes les clés sont collectées
function removeBarrier(scene) {
    if (GameState.level5Barrier) {
        scene.tweens.add({
            targets: GameState.level5Barrier,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                GameState.level5Barrier.destroy();
                GameState.level5Barrier = null;
                if (GameState.level5BarrierCollider) {
                    GameState.level5BarrierCollider.destroy();
                    GameState.level5BarrierCollider = null;
                }
            }
        });
    }
}

// Créer des particules pour la collecte de clé
function createKeyParticles(scene, x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = scene.add.circle(x, y, 4, 0xFFD700);
        particle.setDepth(12);
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 60;
        
        scene.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            scale: 0,
            duration: 600,
            onComplete: () => {
                particle.destroy();
            }
        });
    }
}

// Créer l'affichage du contexte collecté (seulement sur le niveau 5)
function createContextDisplay(scene, height) {
    // Supprimer l'affichage précédent s'il existe
    if (GameState.level5ContextDisplay) {
        destroyContextDisplay();
    }
    
    // Panneau de contexte collecté (fixe à l'écran, en dessous du menu)
    const menuHeight = 60; // Hauteur du menu
    const panelWidth = 300;
    const panelHeight = 80;
    const panelX = 20 + panelWidth / 2; // Position fixe à gauche de l'écran
    const panelY = menuHeight + 20 + panelHeight / 2; // En dessous du menu
    
    const contextPanel = scene.add.graphics();
    contextPanel.fillStyle(0x000000, 0.7);
    contextPanel.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 10);
    contextPanel.setDepth(2500);
    contextPanel.setScrollFactor(0); // Fixe par rapport à la caméra
    
    const contextTitle = scene.add.text(panelX, panelY - 20, "Clés collectées:", {
        fontSize: '16px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    contextTitle.setOrigin(0.5, 0.5);
    contextTitle.setDepth(2501);
    contextTitle.setScrollFactor(0);
    
    const contextText = scene.add.text(panelX, panelY + 15, "0/10 clés", {
        fontSize: '24px',
        fill: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
    });
    contextText.setOrigin(0.5, 0.5);
    contextText.setDepth(2501);
    contextText.setScrollFactor(0);
    
    GameState.level5ContextDisplay = {
        panel: contextPanel,
        title: contextTitle,
        text: contextText
    };
}

// Détruire l'affichage du contexte
function destroyContextDisplay() {
    try {
        if (GameState.level5ContextDisplay) {
            if (GameState.level5ContextDisplay.panel && GameState.level5ContextDisplay.panel.destroy) {
                GameState.level5ContextDisplay.panel.destroy();
            }
            if (GameState.level5ContextDisplay.title && GameState.level5ContextDisplay.title.destroy) {
                GameState.level5ContextDisplay.title.destroy();
            }
            if (GameState.level5ContextDisplay.text && GameState.level5ContextDisplay.text.destroy) {
                GameState.level5ContextDisplay.text.destroy();
            }
            GameState.level5ContextDisplay = null;
        }
    } catch (error) {
        console.error('Erreur dans destroyContextDisplay:', error);
        GameState.level5ContextDisplay = null;
    }
}

// Mettre à jour l'affichage du contexte collecté
function updateContextDisplay(scene) {
    if (GameState.level5ContextDisplay && GameState.currentLevelIndex === 4) {
        const score = GameState.collectedKeys.length;
        const maxScore = 10;
        
        GameState.level5ContextDisplay.text.setText(`${score}/${maxScore} clés`);
        
        // Changer la couleur selon le score
        if (score >= maxScore) {
            GameState.level5ContextDisplay.text.setFill('#00FF00'); // Vert si complet
        } else if (score >= maxScore * 0.7) {
            GameState.level5ContextDisplay.text.setFill('#FFD700'); // Or
        } else {
            GameState.level5ContextDisplay.text.setFill('#FFA500'); // Orange si peu collecté
        }
    }
}

// Réinitialiser le niveau 5
function resetLevel5() {
    try {
        // Détruire les clés individuellement
        if (GameState.level5KeyData) {
            GameState.level5KeyData.forEach(keyData => {
                if (keyData.key && keyData.key.destroy) {
                    keyData.key.destroy();
                }
            });
        }
        
        GameState.collectedKeys = [];
        GameState.level5KeyData = [];
        
        // Détruire les plateformes existantes
        if (GameState.level5Platforms && GameState.level5Platforms.children) {
            GameState.level5Platforms.clear(true, true);
        }
        
        // Détruire la barrière
        if (GameState.level5Barrier) {
            if (GameState.level5Barrier.destroy) {
                GameState.level5Barrier.destroy();
            }
            GameState.level5Barrier = null;
        }
        
        // Réinitialiser les colliders
        if (level5Collider) {
            if (level5Collider.destroy) {
                level5Collider.destroy();
            }
            level5Collider = null;
        }
        if (level5KeyCollider) {
            if (level5KeyCollider.destroy) {
                level5KeyCollider.destroy();
            }
            level5KeyCollider = null;
        }
        if (GameState.level5BarrierCollider) {
            if (GameState.level5BarrierCollider.destroy) {
                GameState.level5BarrierCollider.destroy();
            }
            GameState.level5BarrierCollider = null;
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du niveau 5:', error);
    }
}

// Gérer les interactions avec les plateformes du niveau 5
export function handleLevel5Platforms(scene) {
    try {
        // Afficher/masquer le panneau selon le niveau actuel
        if (GameState.currentLevelIndex === 4) {
            // S'assurer que les éléments sont créés
            if (!GameState.level5Platforms || GameState.level5KeyData.length === 0) {
                const level5 = levels[4];
                createLevel5Platforms(scene, scene.scale.width, scene.scale.height);
            }
            
            // Créer l'affichage s'il n'existe pas
            if (!GameState.level5ContextDisplay) {
                createContextDisplay(scene, scene.scale.height);
            }
            
            // Créer les colliders si nécessaire (toujours vérifier et recréer si manquant)
            if (GameState.player) {
                // Collider pour les plateformes
                if (GameState.level5Platforms && GameState.level5Platforms.children.size > 0) {
                    if (level5Collider) {
                        level5Collider.destroy();
                    }
                    level5Collider = scene.physics.add.collider(GameState.player, GameState.level5Platforms);
                }
                
                // Le collider overlap n'est plus nécessaire
                // On utilise uniquement la vérification manuelle checkKeyCollection()
                
                // Créer le collider avec la barrière si elle existe
                if (GameState.level5Barrier && !GameState.level5BarrierCollider) {
                    GameState.level5BarrierCollider = scene.physics.add.collider(GameState.player, GameState.level5Barrier, () => {
                        // Vérifier si le joueur a toutes les clés
                        if (GameState.collectedKeys.length < 10) {
                            showBarrierMessage(scene, GameState.level5Barrier.x, scene.scale.height / 2);
                        }
                    });
                }
            }
            
            // Vérification manuelle de collision avec les clés (méthode principale)
            // Cette méthode fonctionne à chaque frame et détecte les clés à proximité
            if (GameState.player && GameState.level5KeyData && GameState.level5KeyData.length > 0) {
                checkKeyCollection(scene);
            }
            
            // Mettre à jour l'affichage
            updateContextDisplay(scene);
        } else {
            // Masquer l'affichage si on n'est pas sur le niveau 5
            if (GameState.level5ContextDisplay) {
                destroyContextDisplay();
            }
        }
    } catch (error) {
        console.error('Erreur dans handleLevel5Platforms:', error);
    }
}

// Vérification manuelle de collision avec les clés (méthode alternative)
function checkKeyCollection(scene) {
    if (!GameState.player || !GameState.level5KeyData) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const detectionRadius = 60; // Zone de détection plus large (60px de rayon)
    
    GameState.level5KeyData.forEach(keyData => {
        if (keyData.isCollected || !keyData.key) {
            return;
        }
        
        // Vérifier si la clé existe et est active
        if (!keyData.key.active || !keyData.key.visible) {
            return;
        }
        
        const keyX = keyData.key.x;
        const keyY = keyData.key.y;
        
        // Calculer la distance entre le joueur et la clé
        const distance = Math.sqrt(
            Math.pow(playerX - keyX, 2) + Math.pow(playerY - keyY, 2)
        );
        
        // Si le joueur est assez proche de la clé (zone de détection de 60px)
        if (distance < detectionRadius) {
            console.log('✅ COLLISION DÉTECTÉE avec la clé', keyData.keyIndex, 'distance:', Math.round(distance), 'px');
            // Appeler collectKey manuellement
            collectKey(GameState.player, keyData.key);
        }
    });
}

// Fonction pour détruire toutes les ressources du niveau 5 (appelée lors du changement de niveau)
export function destroyLevel5() {
    resetLevel5();
}
