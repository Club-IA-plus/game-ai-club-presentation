import { levels } from './config.js';
import { GameState } from './gameState.js';

// État de l'audio
const AudioState = {
    currentMusic: null,
    currentLevelIndex: -1,
    fadeOutZone: 0.2, // 20% de la fin du niveau pour commencer le fade out
    fadeInDuration: 1000, // 1 seconde pour le fade in
    fadeOutDuration: 2000, // 2 secondes pour le fade out
    maxVolume: 0.6, // Volume maximum (60%)
    fadeTimer: null,
    isTransitioning: false // Flag pour empêcher les transitions multiples
};

// Initialiser la musique pour un niveau
export function initLevelMusic(scene, levelIndex) {
    // Arrêter toutes les musiques en cours
    stopAllMusicInstances(scene);
    
    // Nettoyer le timer de fade si il existe
    if (AudioState.fadeTimer) {
        clearInterval(AudioState.fadeTimer);
        AudioState.fadeTimer = null;
    }
    
    // Obtenir la clé de la musique pour ce niveau
    const musicKey = `musicLevel${levelIndex + 1}`;
    
    // Arrêter toutes les instances de cette clé avant d'en créer une nouvelle
    scene.sound.stopByKey(musicKey);
    
    // Créer et jouer la nouvelle musique
    AudioState.currentMusic = scene.sound.add(musicKey, {
        volume: AudioState.maxVolume,
        loop: true
    });
    
    AudioState.currentMusic.play();
    AudioState.currentLevelIndex = levelIndex;
    AudioState.isTransitioning = false;
}

// Mettre à jour l'audio en fonction de la position du joueur
export function updateAudio(scene) {
    if (!GameState.player) {
        return;
    }
    
    // Vérifier si on a changé de niveau (priorité à la transition)
    if (GameState.currentLevelIndex !== AudioState.currentLevelIndex && !AudioState.isTransitioning) {
        // Transition vers le nouveau niveau
        transitionToLevel(scene, GameState.currentLevelIndex);
        return;
    }
    
    // Si on est en transition, ne pas faire d'autres modifications
    if (AudioState.isTransitioning) {
        return;
    }
    
    // Si pas de musique, initialiser
    if (AudioState.currentLevelIndex === -1 || !AudioState.currentMusic || !AudioState.currentMusic.isPlaying) {
        if (GameState.currentLevelIndex >= 0) {
            initLevelMusic(scene, GameState.currentLevelIndex);
        }
        return;
    }
    
    const playerX = GameState.player.x;
    const currentLevel = levels[AudioState.currentLevelIndex];
    
    if (!currentLevel) {
        return;
    }
    
    const levelWidth = currentLevel.endX - currentLevel.startX;
    const playerPositionInLevel = playerX - currentLevel.startX;
    const progressInLevel = playerPositionInLevel / levelWidth;
    
    // Zone de fade out : les 20% finaux du niveau
    const fadeOutStart = 1 - AudioState.fadeOutZone;
    
    if (progressInLevel >= fadeOutStart && progressInLevel <= 1) {
        // Fade out progressif dans la zone de transition
        const fadeProgress = (progressInLevel - fadeOutStart) / AudioState.fadeOutZone;
        const targetVolume = AudioState.maxVolume * (1 - fadeProgress);
        AudioState.currentMusic.setVolume(Math.max(0, targetVolume));
    } else if (progressInLevel < fadeOutStart && progressInLevel >= 0) {
        // Volume normal si on n'est pas dans la zone de fade out
        if (AudioState.currentMusic.volume < AudioState.maxVolume) {
            AudioState.currentMusic.setVolume(AudioState.maxVolume);
        }
    }
}

// Arrêter toutes les instances de musique
function stopAllMusicInstances(scene) {
    // Arrêter toutes les musiques par leur clé
    for (let i = 1; i <= 9; i++) {
        scene.sound.stopByKey(`musicLevel${i}`);
    }
    
    // Arrêter la musique actuelle si elle existe
    if (AudioState.currentMusic && AudioState.currentMusic.isPlaying) {
        AudioState.currentMusic.stop();
    }
    AudioState.currentMusic = null;
}

// Transition vers un nouveau niveau
function transitionToLevel(scene, newLevelIndex) {
    if (newLevelIndex < 0 || newLevelIndex >= levels.length) {
        return;
    }
    
    // Empêcher les transitions multiples
    if (AudioState.isTransitioning) {
        return;
    }
    
    AudioState.isTransitioning = true;
    
    // Si on a une musique en cours, faire un fade out rapide
    if (AudioState.currentMusic && AudioState.currentMusic.isPlaying) {
        // Fade out rapide de la musique actuelle
        scene.tweens.add({
            targets: AudioState.currentMusic,
            volume: 0,
            duration: 500, // Fade out rapide en 0.5 seconde
            onComplete: () => {
                AudioState.currentMusic.stop();
                // Démarrer la nouvelle musique avec fade in
                startNewLevelMusic(scene, newLevelIndex);
            }
        });
    } else {
        // Pas de musique en cours, démarrer directement
        startNewLevelMusic(scene, newLevelIndex);
    }
}

// Démarrer la musique d'un nouveau niveau avec fade in
function startNewLevelMusic(scene, levelIndex) {
    const musicKey = `musicLevel${levelIndex + 1}`;
    
    // Arrêter toutes les instances de cette clé avant d'en créer une nouvelle
    scene.sound.stopByKey(musicKey);
    
    // Créer la nouvelle musique
    AudioState.currentMusic = scene.sound.add(musicKey, {
        volume: 0, // Commencer à volume 0
        loop: true
    });
    
    AudioState.currentMusic.play();
    AudioState.currentLevelIndex = levelIndex;
    
    // Fade in progressif
    scene.tweens.add({
        targets: AudioState.currentMusic,
        volume: AudioState.maxVolume,
        duration: AudioState.fadeInDuration,
        ease: 'Linear',
        onComplete: () => {
            AudioState.isTransitioning = false;
        }
    });
}

// Arrêter toute la musique
export function stopAllMusic(scene) {
    if (scene) {
        stopAllMusicInstances(scene);
    } else if (AudioState.currentMusic && AudioState.currentMusic.isPlaying) {
        AudioState.currentMusic.stop();
    }
    AudioState.currentLevelIndex = -1;
    AudioState.isTransitioning = false;
}

