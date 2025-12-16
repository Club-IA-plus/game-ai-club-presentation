let pdfButton = null;
let pdfIcon = null;
let pdfButtonBg = null;
let pdfViewer = null;
let isPdfOpen = false;

// Créer le bouton fichier en bas à droite, à gauche du bouton volume
export function createPdfButton(scene) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const buttonSize = 50;
    const buttonPadding = 15;
    const buttonSpacing = 60; // Espacement entre le bouton fichier et le bouton volume
    const buttonX = width - buttonSize / 2 - buttonPadding - buttonSpacing;
    const buttonY = height - buttonSize / 2 - buttonPadding;
    
    // Fond du bouton (cercle)
    pdfButtonBg = scene.add.circle(buttonX, buttonY, buttonSize / 2, 0x333333, 0.8);
    pdfButtonBg.setScrollFactor(0); // Fixe par rapport à la caméra
    pdfButtonBg.setDepth(2000); // Au-dessus de tout
    pdfButtonBg.setInteractive({ useHandCursor: true });
    
    // Icône de fichier (fermé par défaut)
    pdfIcon = scene.add.text(buttonX, buttonY, '📄', {
        fontSize: '24px',
        align: 'center'
    });
    pdfIcon.setOrigin(0.5, 0.5);
    pdfIcon.setScrollFactor(0);
    pdfIcon.setDepth(2001);
    
    // Effet au survol sur le fond
    pdfButtonBg.on('pointerover', () => {
        pdfButtonBg.setFillStyle(0x555555, 0.9);
    });
    
    pdfButtonBg.on('pointerout', () => {
        pdfButtonBg.setFillStyle(0x333333, 0.8);
    });
    
    // Action au clic sur le fond
    pdfButtonBg.on('pointerdown', () => {
        togglePdfViewer(scene);
    });
    
    // Stocker la référence pour la mise à jour
    pdfButton = pdfButtonBg;
    
    // Créer le viewer PDF (masqué par défaut)
    createPdfViewer(scene);
}

// Créer le viewer PDF
function createPdfViewer(scene) {
    // Créer un élément DOM pour le viewer PDF
    const gameCanvas = scene.game.canvas;
    const gameContainer = gameCanvas.parentElement;
    
    // Créer la div overlay pour le PDF
    pdfViewer = document.createElement('div');
    pdfViewer.id = 'pdf-viewer-overlay';
    pdfViewer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: none;
        justify-content: center;
        align-items: center;
    `;
    
    // Créer le conteneur du PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
        width: 90%;
        height: 90%;
        background-color: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        position: relative;
        display: flex;
        flex-direction: column;
    `;
    
    // Créer le header avec le bouton de fermeture
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e0e0e0;
    `;
    
    const title = document.createElement('h2');
    title.textContent = 'Dashboard';
    title.style.cssText = `
        margin: 0;
        color: #333;
        font-family: Arial, sans-serif;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
        background: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        width: 30px;
        height: 30px;
        font-size: 20px;
        cursor: pointer;
        font-weight: bold;
    `;
    closeButton.onclick = () => {
        togglePdfViewer(scene);
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Créer l'iframe pour afficher le PDF
    const iframe = document.createElement('iframe');
    iframe.src = '../docs/pdf-dashboard-in-game.pdf';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        flex: 1;
    `;
    iframe.type = 'application/pdf';
    
    pdfContainer.appendChild(header);
    pdfContainer.appendChild(iframe);
    pdfViewer.appendChild(pdfContainer);
    
    // Ajouter au DOM
    gameContainer.appendChild(pdfViewer);
    
    // Fermer en cliquant sur l'overlay (mais pas sur le conteneur)
    pdfViewer.addEventListener('click', (e) => {
        if (e.target === pdfViewer) {
            togglePdfViewer(scene);
        }
    });
}

// Toggle l'affichage du PDF
function togglePdfViewer(scene) {
    isPdfOpen = !isPdfOpen;
    
    if (pdfViewer) {
        if (isPdfOpen) {
            pdfViewer.style.display = 'flex';
        } else {
            pdfViewer.style.display = 'none';
        }
    }
    
    // Mettre à jour l'icône
    updatePdfIcon();
    
    // Mettre en pause/reprendre le jeu (optionnel, pour améliorer l'expérience)
    // Le PDF s'affiche par-dessus le jeu, donc on peut laisser le jeu continuer
}

// Mettre à jour l'icône du bouton fichier
function updatePdfIcon() {
    if (pdfIcon) {
        pdfIcon.setText(isPdfOpen ? '📂' : '📄');
    }
}

// Mettre à jour le bouton si nécessaire (pour le redimensionnement)
export function updatePdfButton(scene) {
    if (pdfButton && pdfIcon) {
        const width = scene.scale.width;
        const height = scene.scale.height;
        const buttonSize = 50;
        const buttonPadding = 15;
        const buttonSpacing = 60; // Espacement entre le bouton fichier et le bouton volume
        const buttonX = width - buttonSize / 2 - buttonPadding - buttonSpacing;
        const buttonY = height - buttonSize / 2 - buttonPadding;
        
        pdfButton.setPosition(buttonX, buttonY);
        pdfIcon.setPosition(buttonX, buttonY);
    }
}

