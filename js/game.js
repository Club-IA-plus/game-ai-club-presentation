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
        // Si on entre dans le niveau 5, les éléments seront créés dans handleLevel5Platforms
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
