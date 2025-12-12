import { levels } from './config.js';
import { GameState } from './gameState.js';

// Types de sources pour Notebook LM
const sourceTypes = [
    { type: 'article', name: 'Article', color: 0x3498DB, icon: '📄', description: 'Article scientifique ou blog' },
    { type: 'video', name: 'Vidéo', color: 0x2ECC71, icon: '🎥', description: 'Vidéo éducative ou tutoriel' },
    { type: 'pdf', name: 'PDF', color: 0xF39C12, icon: '📑', description: 'Document PDF ou rapport' },
    { type: 'website', name: 'Site web', color: 0x9B59B6, icon: '🌐', description: 'Site web ou page en ligne' },
    { type: 'quote', name: 'Citation', color: 0xFFD700, icon: '💬', description: 'Citation ou extrait important' }
];

// Sources à collecter (10 sources réparties sur les 5 catégories)
// 3 étages : haut (y: 200-300), milieu (y: 400-500), bas (y: 600-700)
// Espacement de 500px entre chaque source pour permettre la circulation
const sources = [
    // Étage haut (haut du niveau)
    { type: 'article', title: 'IA et Éducation', x: 15100, y: 250 },
    { type: 'video', title: 'Tutoriel Notebook LM', x: 15600, y: 200 },
    { type: 'pdf', title: 'Guide Notebook LM', x: 16100, y: 250 },
    // Étage milieu
    { type: 'website', title: 'Documentation officielle', x: 16600, y: 450 },
    { type: 'quote', title: 'Citation importante', x: 17100, y: 500 },
    { type: 'article', title: 'Prompt Engineering', x: 15200, y: 400 },
    // Étage bas
    { type: 'video', title: 'Démo Notebook LM', x: 15700, y: 650 },
    { type: 'pdf', title: 'Rapport IA 2024', x: 16200, y: 700 },
    { type: 'website', title: 'Blog IA', x: 16700, y: 650 },
    { type: 'quote', title: 'Citation experte', x: 17200, y: 700 }
];

// Création des plateformes de sources pour le niveau 6
export function createLevel6Platforms(scene, width, height) {
    try {
        const level6 = levels[5]; // Index 5 pour le niveau 6
        const level6StartX = level6.startX;
        const level6EndX = level6.endX;
        
        // Ne créer les éléments que si on est sur le niveau 6
        if (GameState.currentLevelIndex !== 5) {
            return;
        }
        
        // Réinitialiser l'état seulement si les éléments existent déjà
        if (GameState.level6Platforms) {
            resetLevel6();
        }
        
        // Créer un groupe de plateformes pour ce niveau
        GameState.level6Platforms = scene.physics.add.staticGroup();
        
        // Réinitialiser les données
        GameState.level6SourceData = [];
        GameState.collectedSources = []; // Sources collectées
        
        // Créer l'affichage du notebook (en dessous du menu)
        createNotebookDisplay(scene, height);
        
        // Créer des plateformes de progression pour permettre de sauter entre elles
        // Plateformes sur 3 étages pour accéder aux sources en hauteur
        const progressionPlatforms = [
            // Étage bas (sol)
            { x: level6StartX + 200, y: height - 120 },
            { x: level6StartX + 700, y: height - 100 },
            { x: level6StartX + 1200, y: height - 120 },
            { x: level6StartX + 1700, y: height - 100 },
            { x: level6StartX + 2200, y: height - 120 },
            { x: level6StartX + 2700, y: height - 100 },
            // Étage milieu (pour accéder aux sources du milieu)
            { x: level6StartX + 450, y: height - 250 },
            { x: level6StartX + 950, y: height - 230 },
            { x: level6StartX + 1450, y: height - 250 },
            { x: level6StartX + 1950, y: height - 230 },
            // Étage haut (pour accéder aux sources en haut)
            { x: level6StartX + 300, y: height - 450 },
            { x: level6StartX + 800, y: height - 430 },
            { x: level6StartX + 1300, y: height - 450 },
            { x: level6StartX + 1800, y: height - 430 }
        ];
        
        progressionPlatforms.forEach(platformPos => {
            const platform = GameState.level6Platforms.create(platformPos.x, platformPos.y, 'platform');
            platform.setScale(0.8, 1).refreshBody();
            platform.setDepth(10);
        });
        
        // Créer les plateformes avec sources
        sources.forEach((source, index) => {
            const sourceType = sourceTypes.find(t => t.type === source.type);
            const platformX = source.x;
            
            // Calculer la largeur de la plateforme en fonction de la longueur du texte
            const iconWidth = 30; // Largeur de l'icône
            const padding = 20; // Padding de chaque côté
            const textWidth = source.title.length * 8; // Estimation : ~8px par caractère
            const platformWidth = iconWidth + textWidth + padding * 2;
            
            // Déterminer la position Y de la plateforme selon l'étage
            let platformY;
            if (source.y < 350) {
                // Étage haut : plateforme en dessous de la source
                platformY = source.y + 60;
            } else if (source.y < 550) {
                // Étage milieu : plateforme en dessous de la source
                platformY = source.y + 60;
            } else {
                // Étage bas : plateforme en dessous de la source
                platformY = source.y + 60;
            }
            
            // Créer la plateforme avec la largeur calculée
            const platform = GameState.level6Platforms.create(platformX, platformY, 'platform');
            platform.setScale(platformWidth / 400, 1).refreshBody(); // 400 est la largeur de base de la plateforme
            platform.setDepth(10);
            
            // Graphique de la plateforme avec la couleur du type
            const platformGraphics = scene.add.graphics();
            platformGraphics.fillStyle(sourceType.color, 0.4);
            platformGraphics.fillRoundedRect(platformX - platformWidth / 2, platformY - 12, platformWidth, 24, 5);
            platformGraphics.setDepth(9);
            
            // Icône du type de source
            const iconText = scene.add.text(platformX - platformWidth / 2 + padding, platformY, sourceType.icon, {
                fontSize: '20px'
            });
            iconText.setOrigin(0, 0.5);
            iconText.setDepth(11);
            
            // Titre de la source (pas de troncature, largeur adaptée)
            const titleText = scene.add.text(platformX - platformWidth / 2 + padding + iconWidth, platformY, source.title, {
                fontSize: '14px',
                fill: '#FFFFFF',
                fontStyle: 'bold',
                maxLines: 1
            });
            titleText.setOrigin(0, 0.5);
            titleText.setDepth(11);
            
            // Créer la source (cercle coloré au-dessus de la plateforme)
            const sourceCircle = scene.add.circle(platformX, source.y, 15, sourceType.color);
            sourceCircle.setStrokeStyle(2, 0xFFFFFF);
            sourceCircle.setDepth(12);
            
            // Ajouter la physique à la source
            scene.physics.add.existing(sourceCircle, true); // static body
            
            if (sourceCircle.body) {
                sourceCircle.body.setCircle(20);
                sourceCircle.body.setOffset(0, 0);
            }
            
            // Stocker les données de la source
            GameState.level6SourceData.push({
                sourceIndex: index,
                sourceX: source.x,
                sourceY: source.y,
                platformX: platformX,
                platformY: platformY,
                platformWidth: platformWidth,
                source: sourceCircle,
                platform: platform,
                platformGraphics: platformGraphics,
                iconText: iconText,
                titleText: titleText,
                sourceType: sourceType,
                sourceData: source,
                isCollected: false
            });
        });
        
        // Créer la barrière à la fin du niveau 6
        createLevel6Barrier(scene, level6EndX, height);
        
        // Créer les colliders si le joueur existe
        if (GameState.player && GameState.level6Platforms && GameState.level6Platforms.children.size > 0) {
            if (!GameState.level6Collider) {
                GameState.level6Collider = scene.physics.add.collider(GameState.player, GameState.level6Platforms);
            }
        }
    } catch (error) {
        console.error('Erreur dans createLevel6Platforms:', error);
    }
}

// Créer l'affichage du notebook
function createNotebookDisplay(scene, height) {
    // Supprimer l'affichage précédent s'il existe
    if (GameState.level6NotebookDisplay) {
        destroyNotebookDisplay();
    }
    
    // Panneau du notebook (fixe à l'écran, en dessous du menu)
    const menuHeight = 60;
    const panelWidth = 350;
    const panelHeight = 200;
    const panelX = 20 + panelWidth / 2;
    const panelY = menuHeight + 20 + panelHeight / 2;
    
    const notebookPanel = scene.add.graphics();
    notebookPanel.fillStyle(0x000000, 0.8);
    notebookPanel.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 10);
    notebookPanel.setDepth(2500);
    notebookPanel.setScrollFactor(0);
    
    const notebookTitle = scene.add.text(panelX, panelY - 80, "📓 Notebook LM", {
        fontSize: '18px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    notebookTitle.setOrigin(0.5, 0.5);
    notebookTitle.setDepth(2501);
    notebookTitle.setScrollFactor(0);
    
    const progressText = scene.add.text(panelX, panelY - 50, "0/10 sources", {
        fontSize: '20px',
        fill: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
    });
    progressText.setOrigin(0.5, 0.5);
    progressText.setDepth(2501);
    progressText.setScrollFactor(0);
    
    const categoriesText = scene.add.text(panelX, panelY - 20, "Catégories: 0/5", {
        fontSize: '16px',
        fill: '#10A37F',
        fontStyle: 'bold'
    });
    categoriesText.setOrigin(0.5, 0.5);
    categoriesText.setDepth(2501);
    categoriesText.setScrollFactor(0);
    
    // Liste des sources collectées (scrollable)
    const sourcesListText = scene.add.text(panelX - panelWidth / 2 + 10, panelY + 10, '', {
        fontSize: '12px',
        fill: '#FFFFFF',
        wordWrap: { width: panelWidth - 20 },
        maxLines: 6
    });
    sourcesListText.setOrigin(0, 0);
    sourcesListText.setDepth(2501);
    sourcesListText.setScrollFactor(0);
    
    GameState.level6NotebookDisplay = {
        panel: notebookPanel,
        title: notebookTitle,
        progressText: progressText,
        categoriesText: categoriesText,
        sourcesList: sourcesListText
    };
}

// Détruire l'affichage du notebook
function destroyNotebookDisplay() {
    try {
        if (GameState.level6NotebookDisplay) {
            if (GameState.level6NotebookDisplay.panel && GameState.level6NotebookDisplay.panel.destroy) {
                GameState.level6NotebookDisplay.panel.destroy();
            }
            if (GameState.level6NotebookDisplay.title && GameState.level6NotebookDisplay.title.destroy) {
                GameState.level6NotebookDisplay.title.destroy();
            }
            if (GameState.level6NotebookDisplay.progressText && GameState.level6NotebookDisplay.progressText.destroy) {
                GameState.level6NotebookDisplay.progressText.destroy();
            }
            if (GameState.level6NotebookDisplay.categoriesText && GameState.level6NotebookDisplay.categoriesText.destroy) {
                GameState.level6NotebookDisplay.categoriesText.destroy();
            }
            if (GameState.level6NotebookDisplay.sourcesList && GameState.level6NotebookDisplay.sourcesList.destroy) {
                GameState.level6NotebookDisplay.sourcesList.destroy();
            }
            GameState.level6NotebookDisplay = null;
        }
    } catch (error) {
        console.error('Erreur dans destroyNotebookDisplay:', error);
        GameState.level6NotebookDisplay = null;
    }
}

// Mettre à jour l'affichage du notebook
function updateNotebookDisplay(scene) {
    if (GameState.level6NotebookDisplay && GameState.currentLevelIndex === 5) {
        const totalSources = GameState.collectedSources.length;
        const maxSources = 10;
        
        // Compter les catégories uniques collectées
        const collectedTypes = [...new Set(GameState.collectedSources.map(s => s.type))];
        const uniqueCategories = collectedTypes.length;
        
        // Mettre à jour le texte de progression
        GameState.level6NotebookDisplay.progressText.setText(`${totalSources}/${maxSources} sources`);
        
        // Changer la couleur selon le progrès
        if (totalSources >= maxSources && uniqueCategories >= 5) {
            GameState.level6NotebookDisplay.progressText.setFill('#00FF00'); // Vert si complet
        } else if (totalSources >= maxSources * 0.7) {
            GameState.level6NotebookDisplay.progressText.setFill('#FFD700'); // Or
        } else {
            GameState.level6NotebookDisplay.progressText.setFill('#FFA500'); // Orange
        }
        
        // Mettre à jour les catégories
        GameState.level6NotebookDisplay.categoriesText.setText(`Catégories: ${uniqueCategories}/5`);
        if (uniqueCategories >= 5) {
            GameState.level6NotebookDisplay.categoriesText.setFill('#00FF00');
        } else {
            GameState.level6NotebookDisplay.categoriesText.setFill('#10A37F');
        }
        
        // Mettre à jour la liste des sources (dernières 6)
        const recentSources = GameState.collectedSources.slice(-6);
        const sourcesList = recentSources.map(s => {
            const type = sourceTypes.find(t => t.type === s.type);
            return `${type.icon} ${s.title}`;
        }).join('\n');
        
        GameState.level6NotebookDisplay.sourcesList.setText(sourcesList || 'Aucune source collectée');
    }
}

// Vérification manuelle de collision avec les sources
function checkSourceCollection(scene) {
    if (!GameState.player || !GameState.level6SourceData) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const detectionRadius = 60; // Zone de détection
    
    GameState.level6SourceData.forEach(sourceData => {
        if (sourceData.isCollected || !sourceData.source) {
            return;
        }
        
        if (!sourceData.source.active || !sourceData.source.visible) {
            return;
        }
        
        const sourceX = sourceData.source.x;
        const sourceY = sourceData.source.y;
        
        // Calculer la distance entre le joueur et la source
        const distance = Math.sqrt(
            Math.pow(playerX - sourceX, 2) + Math.pow(playerY - sourceY, 2)
        );
        
        // Si le joueur est assez proche de la source
        if (distance < detectionRadius) {
            console.log('✅ COLLISION DÉTECTÉE avec la source', sourceData.sourceIndex, 'distance:', Math.round(distance), 'px');
            collectSource(scene, sourceData);
        }
    });
}

// Collecter une source
function collectSource(scene, sourceData) {
    if (sourceData.isCollected) {
        return;
    }
    
    console.log('📚 Collecte de la source', sourceData.sourceData.title, 'réussie !');
    
    // Marquer comme collectée
    sourceData.isCollected = true;
    GameState.collectedSources.push({
        type: sourceData.sourceData.type,
        title: sourceData.sourceData.title,
        sourceType: sourceData.sourceType
    });
    
    // Animation de collecte pour la source
    scene.tweens.add({
        targets: sourceData.source,
        scale: 2,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
            sourceData.source.destroy();
        }
    });
    
    // Animation pour la plateforme (changement de couleur)
    scene.tweens.add({
        targets: sourceData.platformGraphics,
        alpha: 0.7,
        duration: 200,
        yoyo: true,
        repeat: 1
    });
    
    // Changer la couleur de la plateforme pour indiquer qu'elle est collectée
    sourceData.platformGraphics.clear();
    sourceData.platformGraphics.fillStyle(sourceData.sourceType.color, 0.6);
    sourceData.platformGraphics.fillRoundedRect(
        sourceData.platformX - sourceData.platformWidth / 2, 
        sourceData.platformY - 12, 
        sourceData.platformWidth, 
        24, 
        5
    );
    
    // Effet de particules
    createSourceParticles(scene, sourceData.sourceX, sourceData.sourceY, sourceData.sourceType.color);
    
    // Mettre à jour l'affichage
    updateNotebookDisplay(scene);
    
    // Vérifier si toutes les sources sont collectées pour retirer la barrière
    const totalSources = GameState.collectedSources.length;
    const collectedTypes = [...new Set(GameState.collectedSources.map(s => s.type))];
    const uniqueCategories = collectedTypes.length;
    
    if (totalSources >= 10 && uniqueCategories >= 5) {
        removeBarrier(scene);
    }
}

// Créer la barrière à la fin du niveau 6
function createLevel6Barrier(scene, barrierX, height) {
    // Créer une barrière qui bloque le passage
    if (GameState.level6Barrier) {
        GameState.level6Barrier.destroy();
    }
    
    // Créer une barrière plus large et plus haute pour bloquer complètement
    // Positionner légèrement avant la fin pour être sûr de bloquer
    GameState.level6Barrier = scene.add.rectangle(barrierX - 25, height / 2, 100, height + 200, 0xFF0000, 0.5);
    GameState.level6Barrier.setDepth(100);
    scene.physics.add.existing(GameState.level6Barrier, true);
    
    // S'assurer que la barrière est immobile et bloque bien
    if (GameState.level6Barrier.body) {
        GameState.level6Barrier.body.setImmovable(true);
        GameState.level6Barrier.body.setSize(100, height + 200);
    }
    
    // S'assurer que la barrière est immobile et bloque bien
    if (GameState.level6Barrier.body) {
        GameState.level6Barrier.body.setImmovable(true);
        GameState.level6Barrier.body.setSize(100, height + 200);
    }
}

// Afficher un message si le joueur essaie de passer sans toutes les sources
function showBarrierMessage(scene, x, y) {
    // Supprimer le message précédent s'il existe
    if (GameState.level6BarrierMessage) {
        GameState.level6BarrierMessage.destroy();
    }
    
    const totalSources = GameState.collectedSources.length;
    const collectedTypes = [...new Set(GameState.collectedSources.map(s => s.type))];
    const uniqueCategories = collectedTypes.length;
    
    const message = scene.add.text(x, y - 100, `Vous devez collecter\nles 10 sources (${totalSources}/10)\net toutes les catégories (${uniqueCategories}/5)\npour continuer !`, {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });
    message.setOrigin(0.5, 0.5);
    message.setDepth(2500);
    
    GameState.level6BarrierMessage = message;
    
    // Faire disparaître après 3 secondes
    scene.time.delayedCall(3000, () => {
        if (GameState.level6BarrierMessage) {
            scene.tweens.add({
                targets: message,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    message.destroy();
                    GameState.level6BarrierMessage = null;
                }
            });
        }
    });
}

// Retirer la barrière quand toutes les sources sont collectées
function removeBarrier(scene) {
    if (GameState.level6Barrier) {
        scene.tweens.add({
            targets: GameState.level6Barrier,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                GameState.level6Barrier.destroy();
                GameState.level6Barrier = null;
                if (GameState.level6BarrierCollider) {
                    GameState.level6BarrierCollider.destroy();
                    GameState.level6BarrierCollider = null;
                }
            }
        });
    }
}

// Créer des particules pour la collecte de source
function createSourceParticles(scene, x, y, color) {
    for (let i = 0; i < 12; i++) {
        const particle = scene.add.circle(x, y, 4, color);
        particle.setDepth(12);
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 60;
        
        scene.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            alpha: 0,
            scale: 0,
            duration: 600,
            onComplete: () => {
                particle.destroy();
            }
        });
    }
}

// Réinitialiser le niveau 6
function resetLevel6() {
    try {
        // Détruire les sources individuellement
        if (GameState.level6SourceData) {
            GameState.level6SourceData.forEach(sourceData => {
                if (sourceData.source && sourceData.source.destroy) {
                    sourceData.source.destroy();
                }
                if (sourceData.platformGraphics && sourceData.platformGraphics.destroy) {
                    sourceData.platformGraphics.destroy();
                }
                if (sourceData.iconText && sourceData.iconText.destroy) {
                    sourceData.iconText.destroy();
                }
                if (sourceData.titleText && sourceData.titleText.destroy) {
                    sourceData.titleText.destroy();
                }
            });
        }
        
        GameState.collectedSources = [];
        GameState.level6SourceData = [];
        
        // Détruire les plateformes existantes
        if (GameState.level6Platforms && GameState.level6Platforms.children) {
            GameState.level6Platforms.clear(true, true);
        }
        
        // Détruire la barrière
        if (GameState.level6Barrier) {
            if (GameState.level6Barrier.destroy) {
                GameState.level6Barrier.destroy();
            }
            GameState.level6Barrier = null;
        }
        
        // Réinitialiser les colliders
        if (GameState.level6Collider) {
            if (GameState.level6Collider.destroy) {
                GameState.level6Collider.destroy();
            }
            GameState.level6Collider = null;
        }
        if (GameState.level6BarrierCollider) {
            if (GameState.level6BarrierCollider.destroy) {
                GameState.level6BarrierCollider.destroy();
            }
            GameState.level6BarrierCollider = null;
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du niveau 6:', error);
    }
}

// Gérer les interactions avec les plateformes du niveau 6
export function handleLevel6Platforms(scene) {
    try {
        // Afficher/masquer le panneau selon le niveau actuel
        if (GameState.currentLevelIndex === 5) {
            // S'assurer que les éléments sont créés
            if (!GameState.level6Platforms || GameState.level6SourceData.length === 0) {
                createLevel6Platforms(scene, scene.scale.width, scene.scale.height);
            }
            
            // Créer l'affichage s'il n'existe pas
            if (!GameState.level6NotebookDisplay) {
                createNotebookDisplay(scene, scene.scale.height);
            }
            
            // Créer les colliders si nécessaire
            if (GameState.player) {
                if (GameState.level6Platforms && GameState.level6Platforms.children.size > 0) {
                    if (!GameState.level6Collider) {
                        GameState.level6Collider = scene.physics.add.collider(GameState.player, GameState.level6Platforms);
                    }
                }
                
                // Créer le collider avec la barrière si elle existe
                if (GameState.level6Barrier && !GameState.level6BarrierCollider) {
                    // Le collider bloque toujours le passage
                    GameState.level6BarrierCollider = scene.physics.add.collider(
                        GameState.player, 
                        GameState.level6Barrier,
                        (player, barrier) => {
                            // Vérifier si le joueur a toutes les sources
                            const totalSources = GameState.collectedSources.length;
                            const collectedTypes = [...new Set(GameState.collectedSources.map(s => s.type))];
                            const uniqueCategories = collectedTypes.length;
                            
                            if (totalSources < 10 || uniqueCategories < 5) {
                                // Afficher le message
                                showBarrierMessage(scene, barrier.x, scene.scale.height / 2);
                                
                                // Repousser le joueur pour qu'il ne puisse pas passer
                                // Forcer le joueur à rester en arrière de la barrière
                                if (player.x >= barrier.x - 50) {
                                    player.setX(Math.min(player.x, barrier.x - 60));
                                    player.setVelocityX(0); // Arrêter le mouvement
                                }
                            }
                        },
                        null,
                        scene
                    );
                }
                
                // Vérification supplémentaire : empêcher le joueur de passer même s'il arrive à contourner
                if (GameState.player && GameState.level6Barrier) {
                    const totalSources = GameState.collectedSources.length;
                    const collectedTypes = [...new Set(GameState.collectedSources.map(s => s.type))];
                    const uniqueCategories = collectedTypes.length;
                    
                    // Si le joueur essaie de passer sans avoir toutes les sources
                    if (GameState.player.x >= GameState.level6Barrier.x - 50) {
                        if (totalSources < 10 || uniqueCategories < 5) {
                            // Repousser le joueur
                            GameState.player.setX(GameState.level6Barrier.x - 60);
                            GameState.player.setVelocityX(0);
                        }
                    }
                }
            }
            
            // Vérification manuelle de collision avec les sources
            if (GameState.player && GameState.level6SourceData && GameState.level6SourceData.length > 0) {
                checkSourceCollection(scene);
            }
            
            // Mettre à jour l'affichage
            updateNotebookDisplay(scene);
        } else {
            // Masquer l'affichage si on n'est pas sur le niveau 6
            if (GameState.level6NotebookDisplay) {
                destroyNotebookDisplay();
            }
        }
    } catch (error) {
        console.error('Erreur dans handleLevel6Platforms:', error);
    }
}

// Fonction pour détruire toutes les ressources du niveau 6
export function destroyLevel6() {
    resetLevel6();
    destroyNotebookDisplay();
}

