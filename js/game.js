import { config } from './config.js';
import { preload } from './assets.js';
import { createWorld } from './world.js';
import { createPlayer, updatePlayer } from './player.js';
import { createLevelElements, updateLevelDisplay, checkLevelChanges } from './levels.js';
import { handleLevel2Platforms } from './level2.js';

// Création de la scène principale
function create() {
    createWorld(this);
    createPlayer(this);
    createLevelElements(this);
}

// Mise à jour de la boucle de jeu
function update() {
    updatePlayer();
    
    // Vérifier les changements de niveau
    if (checkLevelChanges()) {
        updateLevelDisplay(this);
    }
    
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
