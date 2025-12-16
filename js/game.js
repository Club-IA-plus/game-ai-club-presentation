import { config } from './config.js';
import { preload } from './assets.js';
import { createWorld } from './world.js';
import { createPlayer, updatePlayer } from './player.js';
import { createLevelElements, updateLevelDisplay, checkLevelChanges } from './levels.js';
import { handleLevel1Platforms } from './level1.js';
import { handleLevel2Platforms } from './level2.js';
import { handleLevel3Platforms } from './level3.js';
import { createLevel4Snake, updateLevel4Snake, destroyLevel4Snake } from './level4.js';
import { handleLevel5Platforms, destroyLevel5, createLevel5Platforms } from './level5.js';
import { handleLevel6Platforms, destroyLevel6 } from './level6.js';
import { handleLevel7Platforms, destroyLevel7 } from './level7.js';
import { handleLevel8Elements, destroyLevel8 } from './level8.js';
import { handleLevel9Platforms } from './level9.js';
import { createLevelMenu } from './menu.js';
import { initLevelMusic, updateAudio } from './audio.js';
import { createVolumeButton, updateVolumeButton } from './volumeButton.js';
import { GameState } from './gameState.js';

// Création de la scène principale
function create() {
    createWorld(this);
    createPlayer(this);
    createLevelElements(this);
    createLevelMenu(this);
    
    // Créer le bouton de volume
    createVolumeButton(this);
    
    // Initialiser la musique du premier niveau
    initLevelMusic(this, 0);
    
    // Debug : Afficher la position de la souris dans la console
    this.input.on('pointermove', (pointer) => {
        // Convertir les coordonnées de la caméra en coordonnées du monde
        const worldX = this.cameras.main.scrollX + pointer.x;
        const worldY = this.cameras.main.scrollY + pointer.y;
        console.log(`Souris - Écran: (${pointer.x}, ${pointer.y}) | Monde: (${Math.round(worldX)}, ${Math.round(worldY)})`);
    });
    
    // Debug : Afficher la position au clic pour plus de précision
    this.input.on('pointerdown', (pointer) => {
        const worldX = this.cameras.main.scrollX + pointer.x;
        const worldY = this.cameras.main.scrollY + pointer.y;
        console.log(`🖱️ CLIC - Écran: (${pointer.x}, ${pointer.y}) | Monde: (${Math.round(worldX)}, ${Math.round(worldY)})`);
    });
}

// Mise à jour de la boucle de jeu
function update() {
    updatePlayer();
    
    // Vérifier les changements de niveau
    const levelChanged = checkLevelChanges();
    if (levelChanged) {
        updateLevelDisplay(this);
        
        // Détruire le serpent si on quitte le niveau 4
        if (GameState.currentLevelIndex !== 3) {
            destroyLevel4Snake();
        }
        
        // Réinitialiser le niveau 5 si on quitte le niveau 5
        if (GameState.currentLevelIndex !== 4) {
            destroyLevel5();
        }
        
        // Réinitialiser le niveau 6 si on quitte le niveau 6
        if (GameState.currentLevelIndex !== 5) {
            destroyLevel6();
        }
        
        // Réinitialiser le niveau 7 si on quitte le niveau 7
        if (GameState.currentLevelIndex !== 6) {
            destroyLevel7();
        }
        
        // Réinitialiser le niveau 8 si on quitte le niveau 8
        if (GameState.currentLevelIndex !== 7) {
            destroyLevel8();
        }
    }
    
    // Mettre à jour l'audio (transitions fluides)
    updateAudio(this);
    
    // Gérer les interactions avec les plateformes du niveau 1
    handleLevel1Platforms(this);
    
    // Gérer les interactions avec les plateformes du niveau 2
    handleLevel2Platforms();
    
    // Gérer les interactions avec les plateformes du niveau 3
    handleLevel3Platforms(this);
    
    // Mettre à jour le serpent du niveau 4 (créera les serpents si on entre dans le niveau)
    updateLevel4Snake(this);
    
    // Gérer les interactions avec les plateformes du niveau 5
    handleLevel5Platforms(this);
    
    // Gérer les interactions avec les plateformes du niveau 6
    handleLevel6Platforms(this);
    
    // Gérer les interactions avec les plateformes du niveau 7
    handleLevel7Platforms(this);
    
    // Gérer les interactions avec les éléments du niveau 8
    handleLevel8Elements(this);
    
    // Gérer les interactions avec les plateformes du niveau 9
    handleLevel9Platforms(this);
}

// Configuration de la scène
config.scene = {
    preload: preload,
    create: create,
    update: update
};

// Création du jeu
const game = new Phaser.Game(config);

// Redimensionnement dynamique de la fenêtre
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
    // Mettre à jour la position du bouton de volume
    if (game.scene.scenes[0]) {
        updateVolumeButton(game.scene.scenes[0]);
    }
});
