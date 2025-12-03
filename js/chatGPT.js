import { GameState } from './gameState.js';

// Création de l'interface ChatGPT pour le niveau 2
export function createChatGPTInterface(scene, level2StartX, level2Width, height) {
    // Créer l'interface ChatGPT incrustée (fenêtre flottante - plus grande)
    const interfaceX = level2StartX + level2Width * 0.05;
    const interfaceY = height * 0.05;
    const interfaceWidth = 700; // Plus large
    const interfaceHeight = height * 0.75; // Plus haute pour contenir tous les messages
    
    // Fond de l'interface ChatGPT
    const interfaceBg = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + interfaceHeight / 2, interfaceWidth, interfaceHeight, 0xFFFFFF);
    interfaceBg.setDepth(100);
    interfaceBg.setAlpha(0.95);
    
    // Bordure de l'interface
    const interfaceBorder = scene.add.graphics();
    interfaceBorder.lineStyle(4, 0x10A37F);
    interfaceBorder.strokeRoundedRect(interfaceX, interfaceY, interfaceWidth, interfaceHeight, 20);
    interfaceBorder.setDepth(101);
    
    // Header de l'interface ChatGPT
    const header = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + 40, interfaceWidth, 80, 0x10A37F);
    header.setDepth(101);
    
    // Logo et titre ChatGPT (plus gros)
    const logoGraphics = scene.add.graphics();
    logoGraphics.fillStyle(0xFFFFFF);
    logoGraphics.fillCircle(interfaceX + 50, interfaceY + 40, 18);
    logoGraphics.setDepth(102);
    
    const chatGPTTitle = scene.add.text(interfaceX + 80, interfaceY + 40, 'ChatGPT', {
        fontSize: '28px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    chatGPTTitle.setOrigin(0, 0.5);
    chatGPTTitle.setDepth(102);
    
    // Zone de messages (plus grande pour contenir tous les messages)
    const messagesAreaHeight = interfaceHeight - 120; // Hauteur totale moins le header
    const messagesArea = scene.add.rectangle(interfaceX + interfaceWidth / 2, interfaceY + 100 + messagesAreaHeight / 2, interfaceWidth - 40, messagesAreaHeight, 0xF7F7F8);
    messagesArea.setDepth(101);
    
    // Stocker l'interface pour y ajouter des messages
    GameState.chatGPTInterface = {
        container: messagesArea,
        messages: [],
        startY: interfaceY + 110,
        currentY: interfaceY + 110,
        scene: scene,
        interfaceX: interfaceX,
        interfaceWidth: interfaceWidth,
        messagesAreaHeight: messagesAreaHeight
    };
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
    bubbleGraphics.setDepth(102);
    
    // Texte du message (centré dans la bulle)
    const msgText = scene.add.text(bubbleX + bubbleWidth / 2, messageY, text, {
        fontSize: '18px',
        fill: isAI ? '#000000' : '#FFFFFF',
        wordWrap: { width: bubbleWidth - bubblePadding * 2 },
        align: 'center'
    });
    msgText.setOrigin(0.5, 0.5); // Centrer le texte
    msgText.setDepth(103);
    
    // Stocker le message
    GameState.chatGPTInterface.messages.push({
        graphics: bubbleGraphics,
        text: msgText,
        index: GameState.chatGPTInterface.messages.length,
        height: bubbleHeight
    });
    
    // Déplacer la position Y pour le prochain message (avec espacement)
    GameState.chatGPTInterface.currentY += bubbleHeight + 20; // Espacement de 20px entre les messages
}

// Fonction pour effacer les messages après un certain index
export function clearChatMessagesAfter(index) {
    if (!GameState.chatGPTInterface) return;
    
    // Effacer tous les messages après l'index spécifié
    for (let i = GameState.chatGPTInterface.messages.length - 1; i > index; i--) {
        const msg = GameState.chatGPTInterface.messages[i];
        if (msg.graphics) msg.graphics.destroy();
        if (msg.text) msg.text.destroy();
        GameState.chatGPTInterface.messages.pop();
    }
    
    // Réajuster la position Y
    if (GameState.chatGPTInterface.messages.length > 0) {
        const lastMsg = GameState.chatGPTInterface.messages[GameState.chatGPTInterface.messages.length - 1];
        GameState.chatGPTInterface.currentY = lastMsg.text.y + (lastMsg.height / 2) + 20;
    } else {
        GameState.chatGPTInterface.currentY = GameState.chatGPTInterface.startY;
    }
}

