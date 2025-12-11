// Préchargement des assets du jeu
export function preload() {
    // Créer un sprite de personnage apprenant avec un ordinateur portable (2x plus grand)
    const graphics = this.add.graphics();
    
    // Tête (ovale plus réaliste) - 2x
    graphics.fillStyle(0xFFDBAC); // Couleur peau
    graphics.fillEllipse(32, 22, 20, 22); // Tête ovale au lieu de cercle
    
    // Ombres sur le visage pour plus de réalisme
    graphics.fillStyle(0xF4C2A1); // Couleur peau plus foncée pour les ombres
    graphics.fillEllipse(28, 24, 6, 8); // Ombre sur la joue gauche
    graphics.fillEllipse(36, 24, 6, 8); // Ombre sur la joue droite
    
    // Cheveux (style moderne avec plus de texture) - 2x (brun)
    graphics.fillStyle(0x8B4513); // Brun selle
    graphics.fillEllipse(32, 10, 22, 18); // Cheveux en forme ovale
    graphics.fillRect(12, 10, 40, 10);
    // Mèches de cheveux pour plus de réalisme
    graphics.fillStyle(0x654321); // Brun plus foncé pour les ombres
    graphics.fillEllipse(26, 12, 4, 6);
    graphics.fillEllipse(38, 12, 4, 6);
    
    // Yeux plus réalistes - 2x
    // Blanc des yeux
    graphics.fillStyle(0xFFFFFF);
    graphics.fillEllipse(26, 18, 6, 5);
    graphics.fillEllipse(38, 18, 6, 5);
    
    // Iris (bleu)
    graphics.fillStyle(0x4A90E2);
    graphics.fillCircle(26, 18, 2.5);
    graphics.fillCircle(38, 18, 2.5);
    
    // Pupilles
    graphics.fillStyle(0x000000);
    graphics.fillCircle(26, 18, 1.5);
    graphics.fillCircle(38, 18, 1.5);
    
    // Reflet dans les yeux (pour plus de vie)
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(27, 17, 0.8);
    graphics.fillCircle(39, 17, 0.8);
    
    // Sourcils
    graphics.fillStyle(0x654321); // Brun foncé
    graphics.fillRoundedRect(22, 15, 8, 2, 1);
    graphics.fillRoundedRect(34, 15, 8, 2, 1);
    
    // Nez (plus réaliste)
    graphics.fillStyle(0xE8C4A0); // Couleur peau légèrement plus foncée
    graphics.fillEllipse(32, 22, 3, 4);
    // Narines
    graphics.fillStyle(0xD4A574);
    graphics.fillCircle(31, 24, 0.8);
    graphics.fillCircle(33, 24, 0.8);
    
    // Bouche avec sourire plus réaliste - 2x
    // Lèvres supérieures
    graphics.fillStyle(0xE8A87C); // Couleur lèvres
    graphics.beginPath();
    graphics.arc(32, 28, 6, 0.2, Math.PI - 0.2, false);
    graphics.closePath();
    graphics.fillPath();
    
    // Bouche ouverte (blanc pour les dents)
    graphics.fillStyle(0xFFFFFF);
    graphics.beginPath();
    graphics.arc(32, 30, 7, 0.3, Math.PI - 0.3, false);
    graphics.lineTo(25, 34);
    graphics.arc(32, 30, 7, Math.PI - 0.3, 0.3, true);
    graphics.closePath();
    graphics.fillPath();
    
    // Contour des lèvres
    graphics.lineStyle(1.5, 0xD4A574);
    graphics.arc(32, 30, 7, 0.3, Math.PI - 0.3, false);
    
    // Corps du personnage (rectangle arrondi - t-shirt) - 2x
    graphics.fillStyle(0x3498DB); // Bleu vif pour le t-shirt
    graphics.fillRoundedRect(12, 36, 40, 36, 6);
    
    // Ordinateur portable (tenu devant - élément central) - 2x
    graphics.fillStyle(0x2C3E50); // Gris foncé pour l'écran fermé
    graphics.fillRoundedRect(4, 60, 56, 36, 4);
    
    // Écran de l'ordinateur (ouvert, allumé) - 2x
    graphics.fillStyle(0x1ABC9C); // Turquoise pour l'écran actif
    graphics.fillRoundedRect(8, 64, 48, 24, 2);
    
    // Clavier (ligne en bas de l'écran) - 2x
    graphics.fillStyle(0x34495E);
    graphics.fillRect(12, 84, 40, 4);
    
    // Icône IA sur l'écran (cercles connectés représentant un réseau) - 2x
    graphics.fillStyle(0xFFFFFF);
    graphics.fillCircle(20, 72, 4);
    graphics.fillCircle(32, 72, 4);
    graphics.fillCircle(44, 72, 4);
    graphics.lineStyle(2, 0xFFFFFF);
    graphics.lineBetween(20, 72, 32, 72);
    graphics.lineBetween(32, 72, 44, 72);
    
    // Bras tenant l'ordinateur - 2x
    graphics.fillStyle(0xFFDBAC); // Couleur peau pour les bras
    graphics.fillRect(0, 40, 8, 24);
    graphics.fillRect(56, 40, 8, 24);
    
    graphics.generateTexture('player', 64, 100);
    
    // Créer un sprite pour le sol (herbe)
    this.add.graphics()
        .fillStyle(0x27ae60)
        .fillRect(0, 0, 100, 64)
        .fillStyle(0x2ecc71)
        .fillRect(0, 0, 100, 32)
        .generateTexture('ground', 100, 64);
    
    // Créer des nuages
    this.add.graphics()
        .fillStyle(0xffffff)
        .fillCircle(20, 20, 15)
        .fillCircle(35, 20, 18)
        .fillCircle(50, 20, 15)
        .generateTexture('cloud', 70, 40);
    
    // Créer une texture pour les plateformes flottantes (style ChatGPT)
    this.add.graphics()
        .fillStyle(0x10A37F) // Vert ChatGPT pour les plateformes
        .fillRoundedRect(0, 0, 200, 20, 5)
        .fillStyle(0x0D8B6B) // Vert plus foncé pour le dessous
        .fillRect(0, 20, 200, 4)
        .generateTexture('platform', 200, 24);
    
    // Créer une texture pour les bulles de chat (style ChatGPT)
    const chatBubbleGraphics = this.add.graphics();
    // Bulle de chat utilisateur (blanc)
    chatBubbleGraphics.fillStyle(0xFFFFFF);
    chatBubbleGraphics.fillRoundedRect(0, 0, 180, 60, 10);
    chatBubbleGraphics.generateTexture('chatBubbleUser', 180, 60);
    
    // Bulle de chat IA (vert ChatGPT)
    const chatBubbleAIGraphics = this.add.graphics();
    chatBubbleAIGraphics.fillStyle(0x10A37F);
    chatBubbleAIGraphics.fillRoundedRect(0, 0, 180, 60, 10);
    chatBubbleAIGraphics.generateTexture('chatBubbleAI', 180, 60);
    
    // Créer une texture pour les boîtes aux lettres (panneaux)
    const mailboxGraphics = this.add.graphics();
    // Boîte aux lettres (poteau)
    mailboxGraphics.fillStyle(0x654321); // Marron foncé
    mailboxGraphics.fillRect(0, 0, 8, 30);
    // Boîte (partie supérieure)
    mailboxGraphics.fillStyle(0x4169E1); // Bleu
    mailboxGraphics.fillRoundedRect(-5, 0, 18, 20, 2);
    // Fente pour les lettres
    mailboxGraphics.fillStyle(0x000000);
    mailboxGraphics.fillRect(2, 8, 4, 12);
    mailboxGraphics.generateTexture('mailbox', 10, 30);
    
    // Charger l'image Gemini pour le fond du niveau 1
    this.load.image('geminiBackgroundLevel1', 'images/Gemini_level1.png');
    
    // Charger l'image Gemini pour le fond du niveau 2
    this.load.image('geminiBackground', 'images/Gemini_level2..png');
    
    // Charger l'image Gemini pour le fond du niveau 3
    this.load.image('geminiBackgroundLevel3', 'images/Gemini_level3.png');
    
    // Charger l'image Midjourney pour le fond du niveau 4
    this.load.image('geminiBackgroundLevel4', 'images/midjourney-level4.png');
}

