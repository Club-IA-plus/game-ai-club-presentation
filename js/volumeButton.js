import { toggleMute, isMuted } from './audio.js';

let volumeButton = null;
let volumeIcon = null;
let volumeButtonBg = null;

// Créer le bouton de volume en bas à droite
export function createVolumeButton(scene) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const buttonSize = 50;
    const buttonPadding = 15;
    const buttonX = width - buttonSize / 2 - buttonPadding;
    const buttonY = height - buttonSize / 2 - buttonPadding;
    
    // Fond du bouton (cercle)
    volumeButtonBg = scene.add.circle(buttonX, buttonY, buttonSize / 2, 0x333333, 0.8);
    volumeButtonBg.setScrollFactor(0); // Fixe par rapport à la caméra
    volumeButtonBg.setDepth(2000); // Au-dessus de tout
    volumeButtonBg.setInteractive({ useHandCursor: true });
    
    // Icône de volume (texte pour l'instant, on peut améliorer avec une image plus tard)
    const iconText = isMuted() ? '🔇' : '🔊';
    volumeIcon = scene.add.text(buttonX, buttonY, iconText, {
        fontSize: '24px',
        align: 'center'
    });
    volumeIcon.setOrigin(0.5, 0.5);
    volumeIcon.setScrollFactor(0);
    volumeIcon.setDepth(2001);
    
    // Effet au survol sur le fond
    volumeButtonBg.on('pointerover', () => {
        volumeButtonBg.setFillStyle(0x555555, 0.9);
    });
    
    volumeButtonBg.on('pointerout', () => {
        volumeButtonBg.setFillStyle(0x333333, 0.8);
    });
    
    // Action au clic sur le fond
    volumeButtonBg.on('pointerdown', () => {
        const muted = toggleMute(scene);
        updateVolumeIcon(muted);
    });
    
    // Stocker la référence pour la mise à jour
    volumeButton = volumeButtonBg;
}

// Mettre à jour l'icône du volume
function updateVolumeIcon(muted) {
    if (volumeIcon) {
        volumeIcon.setText(muted ? '🔇' : '🔊');
    }
}

// Mettre à jour le bouton si nécessaire (pour le redimensionnement)
export function updateVolumeButton(scene) {
    if (volumeButton && volumeIcon) {
        const width = scene.scale.width;
        const height = scene.scale.height;
        const buttonSize = 50;
        const buttonPadding = 15;
        const buttonX = width - buttonSize / 2 - buttonPadding;
        const buttonY = height - buttonSize / 2 - buttonPadding;
        
        volumeButton.setPosition(buttonX, buttonY);
        volumeIcon.setPosition(buttonX, buttonY);
    }
}

