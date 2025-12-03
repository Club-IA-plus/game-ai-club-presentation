// État global du jeu - Objet mutable pour permettre les modifications
export const GameState = {
    player: null,
    cursors: null,
    canJump: true,
    currentLevelIndex: 0,
    levelTitleText: null,
    levelDateText: null,
    ground: null,
    worldWidth: 0,
    platforms: null,
    levelPanels: [],
    platformData: [], // Stocker les données des plateformes pour détecter si le joueur est dessus
    chatGPTInterface: null, // Interface ChatGPT incrustée
    chatMessages: [], // Messages affichés dans l'interface
    lastPlatformIndex: -1 // Dernière plateforme visitée
};

