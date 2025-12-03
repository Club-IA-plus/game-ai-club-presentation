// Configuration du jeu Phaser 3 - Plein écran
export const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 }, // Gravité très élevée pour une descente très rapide et linéaire
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Définition des niveaux (sessions du Club IA) - 3x plus grands
export const levels = [
    {
        name: "Lancement du club IA",
        subtitle: "4 fondateurs : Michael, Laure, Hakim, Yohann",
        date: "Avril 2024",
        startX: 0,
        endX: 3000
    },
    {
        name: "Séance Waouh 1",
        subtitle: "Découverte de chatGPT",
        date: "16 septembre 2024",
        startX: 3000,
        endX: 6000
    },
    {
        name: "Séance Waouh 2",
        subtitle: "Découverte de l'image (Midjourney)",
        date: "23 septembre 2024",
        startX: 6000,
        endX: 9000
    },
    {
        name: "Séance Waouh 3",
        subtitle: "Découverte du code (Cursor)",
        date: "30 septembre 2024",
        startX: 9000,
        endX: 12000
    },
    {
        name: "Séance 4",
        subtitle: "Contexte et Chat GPT",
        date: "07 octobre 2024",
        startX: 12000,
        endX: 15000
    },
    {
        name: "Séance 5 & 6",
        subtitle: "Notebook LM",
        date: "14 octobre et 4 Novembre 2024",
        startX: 15000,
        endX: 18000
    },
    {
        name: "Séance 7",
        subtitle: "Prompt Engineering",
        date: "18 Novembre 2024",
        startX: 18000,
        endX: 21000
    },
    {
        name: "Séance 8",
        subtitle: "Création d'image avec Gemini",
        date: "25 Novembre 2024",
        startX: 21000,
        endX: 24000
    },
    {
        name: "Séance 9",
        subtitle: "De la musique avec Suno",
        date: "2 Décembre 2024",
        startX: 24000,
        endX: 27000
    }
];

