import { levels } from './config.js';
import { GameState } from './gameState.js';

// Positions des 5 écrans avec des pommes
// Calculées à partir des coordonnées fournies
// Premier écran: de (22415, 493) à (22591, 336) = largeur 176, hauteur 157
// Tous les écrans ont la même taille (carrés)
const screenWidth = 176;
const screenHeight = 157;

// Position Y du premier écran (référence pour l'alignement)
const firstScreenY = (493 + 336) / 2; // 414.5

const screenPositions = [
    { x: 22180, y: firstScreenY, width: screenWidth, height: screenHeight, index: 0 }, // Écran 1 (bon)
    { x: 22500, y: firstScreenY, width: screenWidth, height: screenHeight, index: 1 }, // Écran 2 (bon)
    { x: 22770, y: firstScreenY, width: screenWidth, height: screenHeight, index: 2 }, // Écran 3 (bon)
    { x: 23050, y: firstScreenY, width: screenWidth, height: screenHeight, index: 3 }, // Écran 4 (bon)
    { x: 23315, y: firstScreenY, width: screenWidth, height: screenHeight, index: 4 },  // Écran 5 (aligné)
    { x: 23620, y: firstScreenY, width: screenWidth, height: screenHeight, index: 5 }  // Écran 6 (aligné)
];

// Positions des pommes collectables en bas
// Alignées avec les écrans, en bas du niveau
// Les positions Y seront calculées dynamiquement en fonction de la hauteur de l'écran
const applePositions = [
    // Les pommes seront placées en bas, alignées avec les écrans
    // Format: { x: positionX, y: height - 100, index: 0-4 }
];

// Création des éléments pour le niveau 8
export function createLevel8Elements(scene, width, height) {
    try {
        const level8 = levels[7]; // Index 7 pour le niveau 8
        const level8StartX = level8.startX;
        const level8EndX = level8.endX;
        
        // Réinitialiser l'état si les éléments existent déjà
        if (GameState.level8Screens && GameState.level8Screens.length > 0) {
            resetLevel8();
        }
        
        // Réinitialiser les données pour recréer les éléments
        GameState.level8Screens = []; // Écrans noirs qui cachent les pommes
        GameState.level8Apples = []; // Pommes collectables
        GameState.collectedApples = []; // Pommes collectées (réinitialiser pour que tout revienne)
        
        // Créer les écrans pour cacher les pommes
        screenPositions.forEach((screenPos, index) => {
            // Couleur #3F4D6C convertie en hexadécimal Phaser (0x3F4D6C)
            const screenColor = 0x3F4D6C;
            const blackScreen = scene.add.rectangle(screenPos.x, screenPos.y, screenPos.width, screenPos.height, screenColor);
            blackScreen.setDepth(100); // Au-dessus de l'image de fond
            blackScreen.setAlpha(1.0); // Totalement opaque pour ne pas laisser passer le fond
            
            // Stocker les données
            GameState.level8Screens.push({
                index: index,
                screen: blackScreen,
                x: screenPos.x,
                y: screenPos.y,
                width: screenPos.width,
                height: screenPos.height,
                isRevealed: false
            });
        });
        
        // Créer les pommes collectables en bas (alignées avec les écrans)
        // Si aucune position n'est définie, utiliser les positions X des écrans
        const applesToCreate = applePositions.length > 0 ? applePositions : screenPositions.map((screen, idx) => ({
            x: screen.x,
            y: height - 250, // 250 pixels du bas (remontées pour nécessiter un saut)
            index: idx
        }));
        
        applesToCreate.forEach((applePos, index) => {
            // Créer une pomme avec un cercle rouge
            const apple = scene.add.circle(applePos.x, applePos.y, 25, 0xFF0000);
            apple.setStrokeStyle(3, 0x8B0000); // Bordure plus foncée
            apple.setDepth(12);
            
            // Ajouter une feuille verte au-dessus
            const leaf = scene.add.circle(applePos.x, applePos.y - 30, 10, 0x00FF00);
            leaf.setDepth(13);
            
            // Animation de pulsation pour la pomme
            scene.tweens.add({
                targets: apple,
                scale: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Animation de pulsation pour la feuille
            scene.tweens.add({
                targets: leaf,
                scale: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Ajouter la physique à la pomme
            scene.physics.add.existing(apple, true); // static body
            if (apple.body) {
                apple.body.setCircle(30); // Zone de collision plus grande
            }
            
            // S'assurer que la pomme est visible et active
            apple.setVisible(true);
            apple.setActive(true);
            
            // Stocker les données
            GameState.level8Apples.push({
                index: index,
                apple: apple,
                leaf: leaf,
                x: applePos.x,
                y: applePos.y,
                isCollected: false
            });
        });
        
    } catch (error) {
        console.error('Erreur dans createLevel8Elements:', error);
    }
}

// Vérification de la collecte des pommes
function checkAppleCollection(scene) {
    if (!GameState.player || !GameState.level8Apples || GameState.level8Apples.length === 0) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const detectionRadius = 80;
    
    GameState.level8Apples.forEach(appleData => {
        if (appleData.isCollected || !appleData.apple) {
            return;
        }
        
        if (!appleData.apple.active) {
            return;
        }
        
        const appleX = appleData.x;
        const appleY = appleData.y;
        
        const distance = Math.sqrt(
            Math.pow(playerX - appleX, 2) + Math.pow(playerY - appleY, 2)
        );
        
        if (distance < detectionRadius) {
            console.log('✅ COLLISION DÉTECTÉE avec la pomme', appleData.index);
            collectApple(scene, appleData);
        }
    });
}

// Collecter une pomme
function collectApple(scene, appleData) {
    if (appleData.isCollected) {
        return;
    }
    
    console.log('🍎 Collecte de la pomme', appleData.index, 'réussie !');
    
    appleData.isCollected = true;
    GameState.collectedApples.push(appleData.index);
    
    // Animation de collecte
    scene.tweens.add({
        targets: [appleData.apple, appleData.leaf],
        y: appleData.y - 100,
        scale: 1.5,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => {
            if (appleData.apple) {
                appleData.apple.destroy();
            }
            if (appleData.leaf) {
                appleData.leaf.destroy();
            }
        }
    });
    
    // Effet de particules
    createAppleParticles(scene, appleData.x, appleData.y);
    
    // Révéler l'écran correspondant
    revealScreen(scene, appleData.index);
}

// Révéler un écran (enlever le cache noir)
function revealScreen(scene, screenIndex) {
    const screenData = GameState.level8Screens.find(s => s.index === screenIndex);
    if (!screenData || screenData.isRevealed) {
        return;
    }
    
    console.log('🎬 Révélation de l\'écran', screenIndex);
    
    screenData.isRevealed = true;
    
    // Animation de fade out pour enlever le cache
    scene.tweens.add({
        targets: screenData.screen,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
            if (screenData.screen) {
                screenData.screen.destroy();
            }
        }
    });
}

// Créer des particules pour la collecte
function createAppleParticles(scene, x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = scene.add.circle(x, y, 4, 0xFF0000); // Rouge comme une pomme
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

// Réinitialiser le niveau 8
function resetLevel8() {
    try {
        if (GameState.level8Screens) {
            GameState.level8Screens.forEach(screenData => {
                if (screenData.screen && screenData.screen.destroy) {
                    screenData.screen.destroy();
                }
            });
        }
        
        if (GameState.level8Apples) {
            GameState.level8Apples.forEach(appleData => {
                if (appleData.apple && appleData.apple.destroy) {
                    appleData.apple.destroy();
                }
                if (appleData.leaf && appleData.leaf.destroy) {
                    appleData.leaf.destroy();
                }
            });
        }
        
        // Réinitialiser les tableaux pour permettre la recréation
        GameState.level8Screens = [];
        GameState.level8Apples = [];
        GameState.collectedApples = [];
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du niveau 8:', error);
    }
}

// Gérer les interactions avec les éléments du niveau 8
export function handleLevel8Elements(scene) {
    try {
        if (GameState.currentLevelIndex === 7) {
            // S'assurer que les éléments sont créés (recréer si nécessaire)
            if (!GameState.level8Screens || GameState.level8Screens.length === 0 || 
                !GameState.level8Apples || GameState.level8Apples.length === 0) {
                createLevel8Elements(scene, scene.scale.width, scene.scale.height);
            }
            
            // Vérifier la collecte des pommes
            if (GameState.player) {
                checkAppleCollection(scene);
            }
        } else {
            // Ne pas détruire les éléments quand on quitte le niveau 8
            // Ils seront recréés automatiquement quand on revient
            // On garde juste les données en mémoire pour ne pas les recréer inutilement
        }
    } catch (error) {
        console.error('Erreur dans handleLevel8Elements:', error);
    }
}

// Détruire les éléments du niveau 8 (appelé quand on quitte le niveau)
export function destroyLevel8() {
    // Ne pas détruire les éléments, juste réinitialiser les données
    // pour qu'ils soient recréés quand on revient
    resetLevel8();
}

