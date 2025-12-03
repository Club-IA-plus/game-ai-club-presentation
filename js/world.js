import { levels } from './config.js';
import { GameState } from './gameState.js';

// Création du monde (fond, nuages, sol)
export function createWorld(scene) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    
    // Calculer la largeur totale du monde (dernier niveau)
    GameState.worldWidth = levels[levels.length - 1].endX;
    
    // Créer le fond avec un ciel dégradé (sur toute la largeur du monde)
    scene.add.rectangle(0, 0, GameState.worldWidth, height, 0x87CEEB).setOrigin(0, 0);
    
    // Ajouter l'image Gemini comme fond du niveau 1 (en arrière-plan)
    const level1 = levels[0]; // Premier niveau
    const level1StartX = level1.startX;
    const level1EndX = level1.endX;
    const level1Width = level1EndX - level1StartX;
    const backgroundImageLevel1 = scene.add.image(level1StartX + level1Width / 2, height / 2, 'geminiBackgroundLevel1');
    backgroundImageLevel1.setDisplaySize(level1Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel1.setOrigin(0.5, 0.5);
    backgroundImageLevel1.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel1.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter des nuages décoratifs sur toute la largeur du monde
    const clouds = scene.add.group();
    const numClouds = Math.floor(GameState.worldWidth / 200);
    for (let i = 0; i < numClouds; i++) {
        const x = (GameState.worldWidth / numClouds) * i + Math.random() * 100;
        const y = Math.random() * (height * 0.3) + 20;
        const scale = 0.5 + Math.random() * 0.5;
        clouds.create(x, y, 'cloud').setScale(scale).setAlpha(0.8).setDepth(50); // Premier plan
    }
    
    // Créer le sol sur toute la largeur du monde
    GameState.ground = scene.physics.add.staticGroup();
    const groundTiles = Math.ceil(GameState.worldWidth / 100) + 1;
    for (let i = 0; i < groundTiles; i++) {
        const tile = GameState.ground.create(i * 100, height, 'ground');
        tile.setOrigin(0, 1);
        tile.setDepth(60); // Premier plan, au-dessus des nuages
        tile.refreshBody();
    }
    
    // Configurer les limites du monde (avec un peu de marge pour éviter les blocages)
    scene.physics.world.setBounds(0, 0, GameState.worldWidth, height);
    
    // Créer des marqueurs visuels pour les limites des niveaux
    for (let i = 1; i < levels.length; i++) {
        const levelStartX = levels[i].startX;
        // Créer une ligne verticale pour marquer le début de chaque niveau
        const marker = scene.add.graphics();
        marker.lineStyle(4, 0xff0000, 0.6);
        marker.lineBetween(levelStartX, 0, levelStartX, height);
        marker.setDepth(500);
        
        // Ajouter un petit panneau avec le numéro du niveau
        const levelNumber = scene.add.text(levelStartX + 10, height - 150, `Niveau ${i + 1}`, {
            fontSize: '16px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 2,
            backgroundColor: '#ffffff',
            padding: { x: 5, y: 2 }
        });
        levelNumber.setOrigin(0, 0);
    }
}

