import { GameState } from './gameState.js';

// Création de l'interface ChatGPT pour le niveau 2
export function createChatGPTInterface(scene, level2StartX, level2Width, height) {
    // Créer l'interface ChatGPT fixe par rapport à l'écran, à gauche
    // Position fixe par rapport à l'écran (pas au niveau/fond)
    const interfaceX = 20; // 20px depuis le bord gauche de l'écran
    const interfaceY = 60 + 45; // 60px depuis le haut + 45px de descente = 105px
    const interfaceWidth = 700; // Plus large
    const interfaceHeight = height * 0.75; // Plus haute pour contenir tous les messages
    
    // Fond de l'interface ChatGPT
    const interfaceBg = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + interfaceHeight / 2, interfaceWidth, interfaceHeight, 0xFFFFFF);
    interfaceBg.setDepth(50); // Profondeur inférieure au joueur (70) pour qu'il passe devant
    interfaceBg.setAlpha(0.95);
    interfaceBg.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Bordure de l'interface
    const interfaceBorder = scene.add.graphics();
    interfaceBorder.lineStyle(4, 0x10A37F);
    interfaceBorder.strokeRoundedRect(interfaceX, interfaceY, interfaceWidth, interfaceHeight, 20);
    interfaceBorder.setDepth(51);
    interfaceBorder.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Header de l'interface ChatGPT
    const header = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + 40, interfaceWidth, 80, 0x10A37F);
    header.setDepth(51);
    header.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Logo et titre ChatGPT (plus gros)
    const logoGraphics = scene.add.graphics();
    logoGraphics.fillStyle(0xFFFFFF);
    logoGraphics.fillCircle(interfaceX + 50, interfaceY + 40, 18);
    logoGraphics.setDepth(52);
    logoGraphics.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    const chatGPTTitle = scene.add.text(interfaceX + 80, interfaceY + 40, 'ChatGPT', {
        fontSize: '28px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    chatGPTTitle.setOrigin(0, 0.5);
    chatGPTTitle.setDepth(52);
    chatGPTTitle.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Zone de messages (plus grande pour contenir tous les messages)
    const messagesAreaHeight = interfaceHeight - 120; // Hauteur totale moins le header
    const messagesArea = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + 100 + messagesAreaHeight / 2, interfaceWidth - 40, messagesAreaHeight, 0xF7F7F8);
    messagesArea.setDepth(51);
    messagesArea.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Stocker les éléments de l'interface pour pouvoir les détruire
    const interfaceElements = {
        bg: interfaceBg,
        border: interfaceBorder,
        header: header,
        logo: logoGraphics,
        title: chatGPTTitle,
        messagesArea: messagesArea
    };
    
    // Stocker l'interface pour y ajouter des messages
    GameState.chatGPTInterface = {
        container: messagesArea,
        messages: [],
        startY: interfaceY + 110,
        currentY: interfaceY + 110,
        scene: scene,
        interfaceX: interfaceX,
        interfaceWidth: interfaceWidth,
        messagesAreaHeight: messagesAreaHeight,
        interfaceY: interfaceY,
        interfaceHeight: interfaceHeight,
        level2StartX: level2StartX, // Stocker pour référence
        level2Width: level2Width, // Stocker pour référence
        elements: interfaceElements, // Stocker les éléments pour pouvoir les détruire
        messagesAreaTop: interfaceY + 110, // Limite supérieure de la zone de messages
        messagesAreaBottom: interfaceY + 110 + messagesAreaHeight - 20 // Limite inférieure de la zone de messages
    };
}

// Détruire l'interface ChatGPT
export function destroyChatGPTInterface() {
    if (!GameState.chatGPTInterface) {
        return;
    }
    
    // Détruire tous les messages
    if (GameState.chatGPTInterface.messages) {
        GameState.chatGPTInterface.messages.forEach(msg => {
            if (msg.graphics) msg.graphics.destroy();
            if (msg.text) msg.text.destroy();
        });
    }
    
    // Détruire les éléments de l'interface
    if (GameState.chatGPTInterface.elements) {
        const elements = GameState.chatGPTInterface.elements;
        if (elements.bg) elements.bg.destroy();
        if (elements.border) elements.border.destroy();
        if (elements.header) elements.header.destroy();
        if (elements.logo) elements.logo.destroy();
        if (elements.title) elements.title.destroy();
        if (elements.messagesArea) elements.messagesArea.destroy();
    }
    
    // Réinitialiser l'interface
    GameState.chatGPTInterface = null;
}

// Fonction pour ajouter un message dans l'interface ChatGPT
export function addChatMessage(messageData) {
    if (!GameState.chatGPTInterface) return;
    
    const { text, isAI } = messageData;
    const scene = GameState.chatGPTInterface.scene;
    const interfaceX = GameState.chatGPTInterface.interfaceX;
    const interfaceWidth = GameState.chatGPTInterface.interfaceWidth;
    const messageY = GameState.chatGPTInterface.currentY;
    
    // Créer la bulle de message (plus grande)
    const bubbleWidth = interfaceWidth - 100;
    const bubblePadding = 20;
    const bubbleX = interfaceX + 50;
    
    // Calculer la hauteur nécessaire pour le texte
    const tempText = scene.add.text(0, 0, text, {
        fontSize: '18px',
        wordWrap: { width: bubbleWidth - bubblePadding * 2 }
    });
    const textHeight = tempText.height;
    tempText.destroy();
    
    const bubbleHeight = Math.max(80, textHeight + bubblePadding * 2); // Minimum 80px, adaptatif selon le texte
    
    const bubbleGraphics = scene.add.graphics();
    if (isAI) {
        // Bulle IA (blanc avec bordure)
        bubbleGraphics.fillStyle(0xFFFFFF);
        bubbleGraphics.fillRoundedRect(bubbleX, messageY - bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
        bubbleGraphics.lineStyle(2, 0xE5E5E6);
        bubbleGraphics.strokeRoundedRect(bubbleX, messageY - bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    } else {
        // Bulle utilisateur (vert ChatGPT)
        bubbleGraphics.fillStyle(0x10A37F);
        bubbleGraphics.fillRoundedRect(bubbleX, messageY - bubbleHeight / 2, bubbleWidth, bubbleHeight, 15);
    }
    bubbleGraphics.setDepth(52); // Profondeur inférieure au joueur (70) pour qu'il passe devant
    bubbleGraphics.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Texte du message (centré dans la bulle)
    const msgText = scene.add.text(bubbleX + bubbleWidth / 2, messageY, text, {
        fontSize: '18px',
        fill: isAI ? '#000000' : '#FFFFFF',
        wordWrap: { width: bubbleWidth - bubblePadding * 2 },
        align: 'center'
    });
    msgText.setOrigin(0.5, 0.5); // Centrer le texte
    msgText.setDepth(53); // Profondeur inférieure au joueur (70) pour qu'il passe devant
    msgText.setScrollFactor(0); // Fixe par rapport à l'écran (caméra)
    
    // Stocker le message
    GameState.chatGPTInterface.messages.push({
        graphics: bubbleGraphics,
        text: msgText,
        index: GameState.chatGPTInterface.messages.length,
        height: bubbleHeight,
        originalY: messageY // Stocker la position Y originale
    });
    
    // Déplacer la position Y pour le prochain message (avec espacement)
    GameState.chatGPTInterface.currentY += bubbleHeight + 20; // Espacement de 20px entre les messages
    
    // Vérifier si le dernier message dépasse la zone visible et faire défiler vers le haut
    updateMessagesScroll();
}

// Mettre à jour le scroll des messages pour garder l'historique visible
function updateMessagesScroll() {
    if (!GameState.chatGPTInterface || GameState.chatGPTInterface.messages.length === 0) {
        return;
    }
    
    const messagesAreaBottom = GameState.chatGPTInterface.messagesAreaBottom;
    const messagesAreaTop = GameState.chatGPTInterface.messagesAreaTop;
    
    // Vérifier si le dernier message dépasse la zone visible
    const lastMessage = GameState.chatGPTInterface.messages[GameState.chatGPTInterface.messages.length - 1];
    if (!lastMessage || !lastMessage.text) {
        return;
    }
    
    const lastMessageBottom = lastMessage.text.y + lastMessage.height / 2;
    
    // Si le dernier message dépasse, faire défiler tous les messages vers le haut
    if (lastMessageBottom > messagesAreaBottom) {
        const overflow = lastMessageBottom - messagesAreaBottom;
        
        // Déplacer tous les messages vers le haut
        GameState.chatGPTInterface.messages.forEach(msg => {
            if (msg.graphics) {
                msg.graphics.y -= overflow;
            }
            if (msg.text) {
                msg.text.y -= overflow;
            }
        });
        
        // Ajuster la position Y actuelle pour le prochain message
        GameState.chatGPTInterface.currentY -= overflow;
        
        // Masquer les messages qui sont maintenant complètement hors de la zone visible (en haut)
        // Mais NE PAS les détruire pour garder l'historique
        GameState.chatGPTInterface.messages.forEach(msg => {
            if (msg.text) {
                const msgTop = msg.text.y - msg.height / 2;
                const msgBottom = msg.text.y + msg.height / 2;
                
                // Masquer si complètement hors de la zone visible
                if (msgBottom < messagesAreaTop || msgTop > messagesAreaBottom) {
                    if (msg.graphics) msg.graphics.setVisible(false);
                    if (msg.text) msg.text.setVisible(false);
                } else {
                    // Afficher si au moins partiellement visible
                    if (msg.graphics) msg.graphics.setVisible(true);
                    if (msg.text) msg.text.setVisible(true);
                }
            }
        });
    } else {
        // S'assurer que tous les messages visibles sont affichés
        GameState.chatGPTInterface.messages.forEach(msg => {
            if (msg.text) {
                const msgTop = msg.text.y - msg.height / 2;
                const msgBottom = msg.text.y + msg.height / 2;
                
                // Afficher si au moins partiellement dans la zone visible
                if (msgBottom >= messagesAreaTop && msgTop <= messagesAreaBottom) {
                    if (msg.graphics) {
                        msg.graphics.setVisible(true);
                        msg.graphics.setAlpha(1.0);
                    }
                    if (msg.text) {
                        msg.text.setVisible(true);
                        msg.text.setAlpha(1.0);
                    }
                } else {
                    // Masquer si complètement hors de la zone visible
                    if (msg.graphics) msg.graphics.setVisible(false);
                    if (msg.text) msg.text.setVisible(false);
                }
            }
        });
    }
}

// Fonction pour masquer les messages après un certain index (garder l'historique)
export function clearChatMessagesAfter(index) {
    if (!GameState.chatGPTInterface) return;
    
    // Masquer tous les messages après l'index spécifié (mais ne pas les détruire pour garder l'historique)
    for (let i = GameState.chatGPTInterface.messages.length - 1; i > index; i--) {
        const msg = GameState.chatGPTInterface.messages[i];
        if (msg.graphics) msg.graphics.setVisible(false);
        if (msg.text) msg.text.setVisible(false);
    }
    
    // Réafficher tous les messages jusqu'à l'index (pour s'assurer qu'ils sont visibles)
    for (let i = 0; i <= index && i < GameState.chatGPTInterface.messages.length; i++) {
        const msg = GameState.chatGPTInterface.messages[i];
        if (msg.graphics) {
            msg.graphics.setVisible(true);
            msg.graphics.setAlpha(1.0);
        }
        if (msg.text) {
            msg.text.setVisible(true);
            msg.text.setAlpha(1.0);
        }
    }
    
    // Réajuster la position Y pour le prochain message
    if (index >= 0 && index < GameState.chatGPTInterface.messages.length) {
        const lastVisibleMsg = GameState.chatGPTInterface.messages[index];
        GameState.chatGPTInterface.currentY = lastVisibleMsg.text.y + (lastVisibleMsg.height / 2) + 20;
    } else if (GameState.chatGPTInterface.messages.length > 0) {
        // Si index est -1, trouver le dernier message visible
        let lastVisibleIndex = -1;
        for (let i = GameState.chatGPTInterface.messages.length - 1; i >= 0; i--) {
            if (GameState.chatGPTInterface.messages[i].text && GameState.chatGPTInterface.messages[i].text.visible) {
                lastVisibleIndex = i;
                break;
            }
        }
        if (lastVisibleIndex >= 0) {
            const lastVisibleMsg = GameState.chatGPTInterface.messages[lastVisibleIndex];
            GameState.chatGPTInterface.currentY = lastVisibleMsg.text.y + (lastVisibleMsg.height / 2) + 20;
        } else {
            GameState.chatGPTInterface.currentY = GameState.chatGPTInterface.startY;
        }
    } else {
        GameState.chatGPTInterface.currentY = GameState.chatGPTInterface.startY;
    }
    
    // Mettre à jour le scroll après masquage
    updateMessagesScroll();
}

