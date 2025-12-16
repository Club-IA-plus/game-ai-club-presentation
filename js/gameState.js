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
    level1InfoBubble: null, // Bulle d'information affichée
    // Niveau 3 - Filtres Midjourney
    level3Platforms: null,
    level3PlatformData: [],
    lastLevel3PlatformIndex: -1,
    level3InfoBubble: null, // Bulle d'information affichée
    level3BackgroundImage: null, // Référence à l'image de fond du niveau 3
    level3FilterResetTimer: null, // Timer pour éviter le clignotement
    // Niveau 5 - Collecte de clés
    level5Platforms: null,
    level5Keys: null, // Groupe de clés
    level5KeyData: [], // Données des clés
    collectedKeys: [], // Clés collectées (indices)
    level5ContextDisplay: null, // Affichage du contexte collecté
    level5BarrierMessage: null, // Message de barrière
    level5Barrier: null, // Barrière à la fin du niveau
    level5BarrierCollider: null, // Collider de la barrière
    // Niveau 6 - Collecte de sources (Notebook LM)
    level6Platforms: null,
    level6SourceData: [], // Données des sources
    collectedSources: [], // Sources collectées
    level6NotebookDisplay: null, // Affichage du notebook
    level6Collider: null, // Collider des plateformes
    level6Barrier: null, // Barrière à la fin du niveau
    level6BarrierCollider: null, // Collider de la barrière
    level6BarrierMessage: null, // Message de barrière
    // Niveau 7 - Construction de prompt (Prompt Engineering)
    level7Platforms: null,
    level7ImprovementData: [], // Données des améliorations
    collectedImprovements: [], // Améliorations collectées
    currentPrompt: '', // Prompt en construction
    level7PromptDisplay: null, // Affichage du prompt
    level7Collider: null, // Collider des plateformes
    level7Barrier: null, // Barrière à la fin du niveau
    level7BarrierCollider: null, // Collider de la barrière
    level7BarrierMessage: null, // Message de barrière
    level7Prisons: [], // Carrés/prisons représentant les catégories CRTF
    // Niveau 8 - Révélation des pommes
    level8Screens: [], // Écrans noirs qui cachent les pommes
    level8Apples: [], // Pommes collectables
    collectedApples: [], // Pommes collectées (indices)
    // Niveau 9 - Filtres audio Suno
    level9Platforms: null,
    level9PlatformData: [],
    lastLevel9PlatformIndex: -1,
    level9InfoBubble: null, // Bulle d'information affichée
    currentAudioFilter: null, // Filtre audio actuel
    level9AudioTween: null, // Tween pour les transitions audio
    level9FilterResetTimer: null, // Timer pour éviter le clignotement
    // Narrateur
    narrator: null // Personnage narrateur au début du jeu
};

