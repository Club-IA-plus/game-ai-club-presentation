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
    
    // Ajouter l'image Gemini comme fond du niveau 3 (en arrière-plan)
    const level3 = levels[2]; // Troisième niveau (index 2)
    const level3StartX = level3.startX;
    const level3EndX = level3.endX;
    const level3Width = level3EndX - level3StartX;
    const backgroundImageLevel3 = scene.add.image(level3StartX + level3Width / 2, height / 2, 'geminiBackgroundLevel3');
    backgroundImageLevel3.setDisplaySize(level3Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel3.setOrigin(0.5, 0.5);
    backgroundImageLevel3.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel3.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Midjourney comme fond du niveau 4 (en arrière-plan)
    const level4 = levels[3]; // Quatrième niveau (index 3)
    const level4StartX = level4.startX;
    const level4EndX = level4.endX;
    const level4Width = level4EndX - level4StartX;
    const backgroundImageLevel4 = scene.add.image(level4StartX + level4Width / 2, height / 2, 'geminiBackgroundLevel4');
    backgroundImageLevel4.setDisplaySize(level4Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel4.setOrigin(0.5, 0.5);
    backgroundImageLevel4.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel4.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Midjourney comme fond du niveau 5 (en arrière-plan)
    const level5 = levels[4]; // Cinquième niveau (index 4)
    const level5StartX = level5.startX;
    const level5EndX = level5.endX;
    const level5Width = level5EndX - level5StartX;
    const backgroundImageLevel5 = scene.add.image(level5StartX + level5Width / 2, height / 2, 'geminiBackgroundLevel5');
    backgroundImageLevel5.setDisplaySize(level5Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel5.setOrigin(0.5, 0.5);
    backgroundImageLevel5.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel5.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Gemini comme fond du niveau 6 (en arrière-plan)
    const level6 = levels[5]; // Sixième niveau (index 5)
    const level6StartX = level6.startX;
    const level6EndX = level6.endX;
    const level6Width = level6EndX - level6StartX;
    const backgroundImageLevel6 = scene.add.image(level6StartX + level6Width / 2, height / 2, 'geminiBackgroundLevel6');
    backgroundImageLevel6.setDisplaySize(level6Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel6.setOrigin(0.5, 0.5);
    backgroundImageLevel6.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel6.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Gemini comme fond du niveau 7 (en arrière-plan)
    const level7 = levels[6]; // Septième niveau (index 6)
    const level7StartX = level7.startX;
    const level7EndX = level7.endX;
    const level7Width = level7EndX - level7StartX;
    const backgroundImageLevel7 = scene.add.image(level7StartX + level7Width / 2, height / 2, 'geminiBackgroundLevel7');
    backgroundImageLevel7.setDisplaySize(level7Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel7.setOrigin(0.5, 0.5);
    backgroundImageLevel7.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel7.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Gemini comme fond du niveau 8 (en arrière-plan)
    const level8 = levels[7]; // Huitième niveau (index 7)
    const level8StartX = level8.startX;
    const level8EndX = level8.endX;
    const level8Width = level8EndX - level8StartX;
    const backgroundImageLevel8 = scene.add.image(level8StartX + level8Width / 2, height / 2, 'geminiBackgroundLevel8');
    backgroundImageLevel8.setDisplaySize(level8Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel8.setOrigin(0.5, 0.5);
    backgroundImageLevel8.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel8.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
    // Ajouter l'image Gemini comme fond du niveau 9 (en arrière-plan)
    const level9 = levels[8]; // Neuvième niveau (index 8)
    const level9StartX = level9.startX;
    const level9EndX = level9.endX;
    const level9Width = level9EndX - level9StartX;
    const backgroundImageLevel9 = scene.add.image(level9StartX + level9Width / 2, height / 2, 'geminiBackgroundLevel9');
    backgroundImageLevel9.setDisplaySize(level9Width, height); // Ajuster la taille pour couvrir tout le niveau
    backgroundImageLevel9.setOrigin(0.5, 0.5);
    backgroundImageLevel9.setDepth(0); // Profondeur la plus basse pour être en arrière-plan
    backgroundImageLevel9.setAlpha(0.8); // Légère transparence pour laisser voir un peu le ciel
    
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

