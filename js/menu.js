import { levels } from './config.js';
import { GameState } from './gameState.js';
import { updateLevelDisplay } from './levels.js';

// Stocker les références aux boutons pour pouvoir les mettre à jour
let menuButtons = [];
let menuTitleText = null;
let menuDescriptionText = null;

// Création du menu de navigation des niveaux
export function createLevelMenu(scene) {
    const menuY = 0; // Commence en haut de l'écran
    const menuHeight = 60; // Doublé de 30 à 60
    const menuPadding = 5;
    const buttonHeight = 50; // Augmenté pour correspondre à la nouvelle hauteur
    const buttonSpacing = 5;
    
    // Créer un fond noir semi-transparent pour le menu
    const totalMenuHeight = menuHeight + menuPadding * 2;
    const menuBg = scene.add.rectangle(0, 0, scene.scale.width, totalMenuHeight, 0x000000, 0.7);
    menuBg.setOrigin(0, 0);
    menuBg.setScrollFactor(0); // Fixe par rapport à la caméra
    menuBg.setDepth(2000); // Au-dessus de tout
    menuBg.setInteractive();
    
    // Réinitialiser le tableau des boutons
    menuButtons = [];
    
    // Créer les boutons pour chaque niveau
    let currentX = menuPadding;
    const buttonWidth = 100;
    const menuCenterY = totalMenuHeight / 2; // Centre vertical exact de la bande (depuis Y=0)
    
    levels.forEach((level, index) => {
        const buttonX = currentX;
        const buttonCenterX = buttonX + buttonWidth / 2;
        const buttonCenterY = menuCenterY; // Centré verticalement dans la bande
        
        // Fond du bouton - centré verticalement
        const buttonBg = scene.add.rectangle(buttonCenterX, buttonCenterY, buttonWidth, buttonHeight, 0x333333);
        buttonBg.setOrigin(0.5, 0.5);
        buttonBg.setScrollFactor(0);
        buttonBg.setDepth(2001);
        buttonBg.setInteractive({ useHandCursor: true });
        
        // Texte du bouton - centré verticalement
        const buttonText = scene.add.text(buttonCenterX, buttonCenterY, `Lvl ${index + 1}`, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5, 0.5);
        buttonText.setScrollFactor(0);
        buttonText.setDepth(2002);
        
        // Effet hover
        buttonBg.on('pointerover', () => {
            if (GameState.currentLevelIndex !== index) {
                buttonBg.setFillStyle(0x555555);
            }
        });
        
        buttonBg.on('pointerout', () => {
            updateButtonColor(buttonBg, index);
        });
        
        // Clic sur le bouton
        buttonBg.on('pointerdown', () => {
            teleportToLevel(scene, index);
        });
        
        // Stocker la référence au bouton
        menuButtons.push({
            bg: buttonBg,
            text: buttonText,
            index: index
        });
        
        // Mettre en évidence le niveau actuel
        updateButtonColor(buttonBg, index);
        
        currentX += buttonWidth + buttonSpacing;
    });
    
    // Calculer la position pour le texte (après les boutons)
    const textStartX = currentX + 20; // Espacement après les boutons
    const textY = menuCenterY; // Centré verticalement dans la bande
    
    // Créer le texte combiné : titre, virgule, description
    const currentLevel = levels[GameState.currentLevelIndex];
    const combinedText = currentLevel.name + ', ' + currentLevel.subtitle;
    menuTitleText = scene.add.text(textStartX, textY, combinedText, {
        fontSize: '28px', // Doublé de 14px à 28px
        fill: '#ffffff',
        fontStyle: 'bold'
    });
    menuTitleText.setOrigin(0, 0.5);
    menuTitleText.setScrollFactor(0);
    menuTitleText.setDepth(2002);
    
    // Garder une référence pour la description (même objet texte)
    menuDescriptionText = menuTitleText;
}

// Mettre à jour la couleur d'un bouton selon son état
function updateButtonColor(buttonBg, index) {
    if (GameState.currentLevelIndex === index) {
        buttonBg.setFillStyle(0x10A37F); // Vert pour le niveau actif
    } else {
        buttonBg.setFillStyle(0x333333); // Gris pour les autres niveaux
    }
}

// Mettre à jour tous les boutons du menu et les textes
export function updateLevelMenu() {
    menuButtons.forEach(button => {
        updateButtonColor(button.bg, button.index);
    });
    
    // Mettre à jour le titre et la description du niveau actuel
    if (menuTitleText) {
        const currentLevel = levels[GameState.currentLevelIndex];
        const combinedText = currentLevel.name + ', ' + currentLevel.subtitle;
        menuTitleText.setText(combinedText);
    }
}

// Téléporter le joueur au début d'un niveau
function teleportToLevel(scene, levelIndex) {
    if (levelIndex < 0 || levelIndex >= levels.length || !GameState.player) {
        return;
    }
    
    const targetLevel = levels[levelIndex];
    const targetX = targetLevel.startX + 100; // Positionner légèrement après le début du niveau
    const height = scene.scale.height;
    
    // Téléporter le joueur
    GameState.player.x = targetX;
    GameState.player.y = height - 180; // Même hauteur que la position initiale
    
    // Mettre à jour l'index du niveau
    GameState.currentLevelIndex = levelIndex;
    
    // Mettre à jour l'affichage du niveau
    updateLevelDisplay(scene);
    
    // Mettre à jour les boutons du menu pour refléter le niveau actif
    updateLevelMenu();
}


