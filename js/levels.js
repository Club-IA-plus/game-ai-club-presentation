import { levels } from './config.js';
import { GameState } from './gameState.js';
import { createLevel1Platforms } from './level1.js';
import { createLevel2Platforms } from './level2.js';
import { updateLevelMenu } from './menu.js';

// Mise à jour de l'affichage du niveau actuel
export function updateLevelDisplay(scene) {
    // Mettre à jour le menu de navigation (qui contient maintenant toutes les infos du niveau)
    updateLevelMenu();
}

// Création des éléments de niveau (textes, plateformes, etc.)
export function createLevelElements(scene) {
    const width = scene.scale.width;
    
    // Les textes de niveau ont été retirés - les informations sont maintenant dans le menu en haut
    
    // Mettre à jour l'affichage du niveau initial
    updateLevelDisplay(scene);
    
    // Créer les plateformes et panneaux pour les niveaux spécifiques (après création du joueur)
    createLevel1Platforms(scene, width, scene.scale.height);
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

