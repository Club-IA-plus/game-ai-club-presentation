// État global du jeu - Objet mutable pour permettre les modifications
export const GameState = {
    player: null,
    cursors: null,
    canJump: true,
    currentLevelIndex: 0,
    levelTitleText: null,
    ground: null,
    worldWidth: 0,
    platforms: null,
    levelPanels: [],
    platformData: [], // Stocker les données des plateformes pour détecter si le joueur est dessus
    chatGPTInterface: null, // Interface ChatGPT incrustée
    chatMessages: [], // Messages affichés dans l'interface
    lastPlatformIndex: -1, // Dernière plateforme visitée
    // Niveau 1 - Portraits des fondateurs
    level1Platforms: null,
    level1PlatformData: [],
    lastLevel1PlatformIndex: -1,
    level1InfoBubble: null // Bulle d'information affichée
};

