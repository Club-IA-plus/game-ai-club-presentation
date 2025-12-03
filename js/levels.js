import { levels } from './config.js';
import { GameState } from './gameState.js';
import { createLevel2Platforms } from './level2.js';
import { updateLevelMenu } from './menu.js';

// Mise à jour de l'affichage du niveau actuel
export function updateLevelDisplay(scene) {
    const currentLevel = levels[GameState.currentLevelIndex];
    const width = scene.scale.width;
    
    // Mettre à jour le titre du niveau
    GameState.levelTitleText.setText(currentLevel.name);
    GameState.levelTitleText.setPosition(width / 2 - GameState.levelTitleText.width / 2, 20);
    
    // Mettre à jour le menu de navigation
    updateLevelMenu();
}

// Création des éléments de niveau (textes, plateformes, etc.)
export function createLevelElements(scene) {
    const width = scene.scale.width;
    
    // Créer le texte pour afficher le niveau actuel (fixe par rapport à la caméra)
    GameState.levelTitleText = scene.add.text(0, 0, '', {
        fontSize: '32px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(1000);
    
    // Le texte jaune (date) a été retiré - les informations sont maintenant dans le menu en haut
    
    // Mettre à jour l'affichage du niveau initial
    updateLevelDisplay(scene);
    
    // Créer les plateformes et panneaux pour les niveaux spécifiques (après création du joueur)
    createLevel2Platforms(scene, width, scene.scale.height);
}

// Vérification des changements de niveau
export function checkLevelChanges() {
    // Vérifier que le joueur existe
    if (!GameState.player) {
        return false;
    }
    
    const playerX = GameState.player.x;
    
    // Vérifier si on avance vers un niveau suivant
    if (GameState.currentLevelIndex < levels.length - 1) {
        const nextLevel = levels[GameState.currentLevelIndex + 1];
        if (playerX >= nextLevel.startX) {
            GameState.currentLevelIndex++;
            return true; // Indique qu'un changement de niveau a eu lieu
        }
    }
    
    // Vérifier si on recule vers un niveau précédent
    if (GameState.currentLevelIndex > 0) {
        const currentLevel = levels[GameState.currentLevelIndex];
        if (playerX < currentLevel.startX) {
            GameState.currentLevelIndex--;
            return true; // Indique qu'un changement de niveau a eu lieu
        }
    }
    
    return false;
}

