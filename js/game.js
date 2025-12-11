import { config } from './config.js';
import { preload } from './assets.js';
import { createWorld } from './world.js';
import { createPlayer, updatePlayer } from './player.js';
import { createLevelElements, updateLevelDisplay, checkLevelChanges } from './levels.js';
import { handleLevel2Platforms } from './level2.js';
import { createLevelMenu } from './menu.js';
import { initLevelMusic, updateAudio } from './audio.js';

// Création de la scène principale
function create() {
    createWorld(this);
    createPlayer(this);
    createLevelElements(this);
    createLevelMenu(this);
    
    // Initialiser la musique du premier niveau
    initLevelMusic(this, 0);
}

// Mise à jour de la boucle de jeu
function update() {
    updatePlayer();
    
    // Vérifier les changements de niveau
    if (checkLevelChanges()) {
        updateLevelDisplay(this);
    }
    
    // Mettre à jour l'audio (transitions fluides)
    updateAudio(this);
    
    // Gérer les interactions avec les plateformes du niveau 2
    handleLevel2Platforms();
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
});
