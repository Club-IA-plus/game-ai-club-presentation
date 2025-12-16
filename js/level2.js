import { levels } from './config.js';
import { GameState } from './gameState.js';
import { createChatGPTInterface, addChatMessage, clearChatMessagesAfter, destroyChatGPTInterface } from './chatGPT.js';

// Messages de conversation pour le niveau 2 (8 phrases uniques, une par plateforme)
const conversationMessages = [
    { text: "Bonjour ! Je suis ChatGPT, un assistant IA conversationnel développé par OpenAI.", isAI: true },
    { text: "Wahou ! C'est génial ! Comment ça fonctionne ?", isAI: false },
    { text: "Je suis entraîné sur d'énormes quantités de texte pour comprendre le langage naturel et générer des réponses pertinentes.", isAI: true },
    { text: "Tu peux vraiment répondre à n'importe quelle question ?", isAI: false },
    { text: "Je peux aider sur de nombreux sujets, mais j'ai mes limites. Je ne remplace pas l'expertise humaine.", isAI: true },
    { text: "C'est impressionnant ! Mais ça pose des questions d'éthique, non ?", isAI: false },
    { text: "Absolument. L'IA soulève des questions importantes : transparence, biais, impact sur l'emploi, et l'usage responsable de la technologie.", isAI: true },
    { text: "Merci pour cette découverte fascinante ! Je comprends mieux maintenant.", isAI: false }
];

// Création des plateformes et de l'interface ChatGPT pour le niveau 2
export function createLevel2Platforms(scene, width, height) {
    // Niveau 2 : Séance Waouh 1 - Découverte de chatGPT
    const level2 = levels[1]; // Index 1 pour le niveau 2
    const level2StartX = level2.startX;
    const level2EndX = level2.endX;
    const level2Width = level2EndX - level2StartX;
    
    // Réinitialiser l'état du niveau 2 si on revient dessus
    if (GameState.chatGPTInterface) {
        destroyChatGPTInterface();
    }
    GameState.lastPlatformIndex = -1;
    
    // Ajouter l'image Gemini comme fond du niveau 2 (en arrière-plan)
    const backgroundImage = scene.add.image(level2StartX + level2Width / 2, height / 2, 'geminiBackground');
    backgroundImage.setDisplaySize(level2Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImage.setOrigin(0.5, 0.5);
    backgroundImage.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImage.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Créer l'interface ChatGPT (uniquement pour le niveau 2)
    createChatGPTInterface(scene, level2StartX, level2Width, height);
    
    // Créer un groupe de plateformes pour ce niveau
    if (!GameState.platforms) {
        GameState.platforms = scene.physics.add.staticGroup();
    }
    GameState.platformData = [];
    
    // Créer 8 plateformes en escalier (presque collées sur l'axe X)
    const numPlatforms = 8;
    const platformWidth = 120; // Largeur d'une plateforme (200 * 0.6)
    const spacingBetweenPlatforms = 20; // Espacement très réduit entre les plateformes (presque collées)
    const totalPlatformsWidth = (numPlatforms * platformWidth) + ((numPlatforms - 1) * spacingBetweenPlatforms);
    const startX = level2StartX + (level2Width - totalPlatformsWidth) / 2; // Centrer le groupe de plateformes
    const baseY = height - 150;
    
    for (let i = 0; i < numPlatforms; i++) {
        const platformX = startX + (i * (platformWidth + spacingBetweenPlatforms)) + platformWidth / 2;
        const platformY = baseY - (i * 80); // Escalier montant
        const platform = GameState.platforms.create(platformX, platformY, 'platform');
        platform.setScale(0.6, 1).refreshBody(); // Plateformes beaucoup plus petites
        platform.setDepth(10);
        
        // Stocker les données de la plateforme avec son message unique
        GameState.platformData.push({
            index: i,
            platformX: platformX,
            platformY: platformY,
            platformWidth: platformWidth,
            platformHeight: 24,
            message: conversationMessages[i] // Chaque plateforme a son propre message
        });
    }
    
    // Collision entre le joueur et les plateformes (si le joueur existe)
    if (GameState.player && GameState.platforms) {
        scene.physics.add.collider(GameState.player, GameState.platforms);
    }
}

// Gestion des interactions avec les plateformes du niveau 2
export function handleLevel2Platforms() {
    // Si on n'est pas sur le niveau 2, détruire l'interface ChatGPT
    if (GameState.currentLevelIndex !== 1) {
        if (GameState.chatGPTInterface) {
            destroyChatGPTInterface();
        }
        // Réinitialiser l'état du niveau 2
        GameState.lastPlatformIndex = -1;
        return;
    }
    
    // S'assurer que l'interface ChatGPT existe (au cas où elle n'aurait pas été créée)
    if (!GameState.chatGPTInterface) {
        const level2 = levels[1];
        const level2StartX = level2.startX;
        const level2Width = level2.endX - level2.startX;
        createChatGPTInterface(GameState.player.scene, level2StartX, level2Width, GameState.player.scene.scale.height);
    }
    
    if (!GameState.player || GameState.platformData.length === 0 || !GameState.chatGPTInterface) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const playerWidth = GameState.player.width;
    const playerHeight = GameState.player.height;
    
    // Trouver sur quelle plateforme le joueur est
    let currentPlatformIndex = -1;
    GameState.platformData.forEach((data, index) => {
        const { platformX, platformY, platformWidth, platformHeight } = data;
        
        // Vérifier si le joueur est sur la plateforme (et au sol)
        const isOnPlatform = GameState.player.body.touching.down &&
                             playerY + playerHeight / 2 <= platformY + platformHeight / 2 + 10 &&
                             playerY + playerHeight / 2 >= platformY - platformHeight / 2 - 10 &&
                             playerX >= platformX - platformWidth / 2 &&
                             playerX <= platformX + platformWidth / 2;
        
        if (isOnPlatform) {
            currentPlatformIndex = index;
        }
    });
    
    // Si le joueur est sur une nouvelle plateforme, afficher le message
    if (currentPlatformIndex !== -1 && currentPlatformIndex !== GameState.lastPlatformIndex) {
        // Si on recule, effacer les messages après celui-ci
        if (currentPlatformIndex < GameState.lastPlatformIndex) {
            clearChatMessagesAfter(currentPlatformIndex);
        }
        
        // Afficher le message de cette plateforme (si on avance ou si c'est la première)
        // Vérifier si le message existe déjà dans l'historique (pour permettre de revenir sur les plateformes)
        const existingMessage = GameState.chatGPTInterface.messages[currentPlatformIndex];
        if (existingMessage) {
            // Réafficher le message existant
            if (existingMessage.graphics) {
                existingMessage.graphics.setVisible(true);
                existingMessage.graphics.setAlpha(1.0);
            }
            if (existingMessage.text) {
                existingMessage.text.setVisible(true);
                existingMessage.text.setAlpha(1.0);
            }
            // Masquer les messages après celui-ci
            for (let i = currentPlatformIndex + 1; i < GameState.chatGPTInterface.messages.length; i++) {
                const msg = GameState.chatGPTInterface.messages[i];
                if (msg.graphics) msg.graphics.setVisible(false);
                if (msg.text) msg.text.setVisible(false);
            }
        } else if (currentPlatformIndex > GameState.lastPlatformIndex || GameState.lastPlatformIndex === -1) {
            // Créer un nouveau message
            addChatMessage(GameState.platformData[currentPlatformIndex].message);
        }
        GameState.lastPlatformIndex = currentPlatformIndex;
    }
    
    // Si le joueur n'est plus sur une plateforme et qu'on recule, effacer les messages
    if (currentPlatformIndex === -1 && GameState.lastPlatformIndex !== -1) {
        const playerOnGround = GameState.player.body.touching.down;
        if (playerOnGround && playerX < GameState.platformData[GameState.lastPlatformIndex].platformX) {
            clearChatMessagesAfter(-1);
            GameState.lastPlatformIndex = -1;
        }
    }
}

