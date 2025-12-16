import { levels } from './config.js';
import { GameState } from './gameState.js';

// Catégories d'amélioration de prompt (méthode CRTF)
const promptCategories = {
    contexte: {
        name: 'Contexte',
        color: 0x3498DB,
        icon: '🌍',
        elements: [
            { text: 'Entreprise industrielle de 250 salariés', value: 'Tu interviens dans une entreprise industrielle de 250 salariés' },
            { text: 'Rapport trimestriel de performance', value: 'qui prépare son rapport trimestriel de performance destiné au comité de direction' },
            { text: 'Objectif: résultats financiers et opérationnels', value: 'L\'objectif est de présenter les résultats financiers et opérationnels du dernier trimestre' },
            { text: 'Analyse des écarts et améliorations', value: 'd\'en analyser les écarts par rapport aux objectifs et de proposer des pistes d\'amélioration' }
        ]
    },
    role: {
        name: 'Rôle',
        color: 0x2ECC71,
        icon: '👤',
        elements: [
            { text: 'Business Analyst senior', value: 'Tu es un Business Analyst senior, spécialiste en analyse de données de performance' },
            { text: 'Communication managériale', value: 'et en communication managériale' },
            { text: 'Culture en pilotage industriel', value: 'Tu disposes d\'une solide culture en pilotage industriel, lecture de bilans' },
            { text: 'Rédaction de rapports exécutifs', value: 'et rédaction de rapports exécutifs' }
        ]
    },
    taches: {
        name: 'Tâches',
        color: 0xF39C12,
        icon: '📋',
        elements: [
            { text: 'Analyser les données financières et RH', value: 'Analyser les données financières et RH du dernier trimestre (CA, marge, productivité, taux d\'absentéisme)' },
            { text: 'Identifier les 3 indicateurs clés', value: 'Identifier les 3 indicateurs les plus significatifs pour le comité de direction' },
            { text: 'Comparer avec le trimestre précédent', value: 'Comparer les résultats avec le trimestre précédent et les objectifs fixés' },
            { text: 'Synthétiser les écarts', value: 'Synthétiser les écarts et en expliquer les causes principales' },
            { text: 'Proposer 3 actions correctives', value: 'Proposer 3 actions correctives concrètes et réalistes pour le trimestre suivant' }
        ]
    },
    format: {
        name: 'Format',
        color: 0x9B59B6,
        icon: '📄',
        elements: [
            { text: 'Rapport de 3 pages maximum', value: 'Rédige un rapport de 3 pages maximum' },
            { text: 'Synthèse exécutive (10 lignes)', value: 'Page 1 : Synthèse exécutive (10 lignes, ton professionnel, orienté décision)' },
            { text: 'Tableau comparatif des indicateurs', value: 'Page 2 : Tableau comparatif des indicateurs clés (CA, marge, productivité, RH)' },
            { text: 'Analyse & recommandations avec graphique', value: 'Page 3 : Analyse & recommandations, avec 1 graphique comparatif Trimestre N / N-1' },
            { text: 'Ton professionnel et concis', value: 'Le ton doit être professionnel, concis et orienté vers la prise de décision' }
        ]
    },
    contraintes: {
        name: 'Contraintes',
        color: 0xFF0000,
        icon: '⚠️',
        elements: [
            { text: 'Confidentialité: pas de noms', value: 'Confidentialité : ne pas inclure de noms de personnes ou de clients' },
            { text: 'Périmètre: dernier trimestre uniquement', value: 'Périmètre : se limiter au dernier trimestre (pas d\'analyse annuelle)' },
            { text: 'Outils: données internes uniquement', value: 'Outils : exploiter uniquement des données internes (Excel, ERP, RH)' },
            { text: 'Délai: 5 jours ouvrés', value: 'Délai de livraison : 5 jours ouvrés' },
            { text: 'Budget: pas d\'outil externe payant', value: 'Budget : pas d\'outil externe payant ni de traitement automatique additionnel' }
        ]
    }
};

// Prompt de base
const basePrompt = "Prompt en construction...\n\nCollectez les éléments CRTF pour construire votre prompt !";

// Positions des 5 éléments d'amélioration (une par lettre CRTF)
const improvementPositions = [
    { category: 'contexte', elementIndex: 0 },
    { category: 'role', elementIndex: 0 },
    { category: 'taches', elementIndex: 0 },
    { category: 'format', elementIndex: 0 },
    { category: 'contraintes', elementIndex: 0 }
];

// Création des plateformes pour le niveau 7
export function createLevel7Platforms(scene, width, height) {
    try {
        const level7 = levels[6]; // Index 6 pour le niveau 7
        const level7StartX = level7.startX;
        const level7EndX = level7.endX;
        
        // Réinitialiser l'état seulement si les éléments existent déjà
        if (GameState.level7Platforms) {
            resetLevel7();
        }
        
        // Créer un groupe de plateformes pour ce niveau
        GameState.level7Platforms = scene.physics.add.staticGroup();
        
        // Réinitialiser les données
        GameState.level7ImprovementData = [];
        GameState.collectedImprovements = [];
        GameState.currentPrompt = basePrompt;
        
        // Créer l'affichage du prompt en construction
        createPromptDisplay(scene, height);
        
        // Positions des objets collectables CRTF (remontés pour être plus visibles)
        const collectablePositions = [
            { category: 'contexte', x: 18480, y: height - 200, label: 'C' },
            { category: 'role', x: 18771, y: height - 200, label: 'R' },
            { category: 'taches', x: 19350, y: height - 200, label: 'T' },
            { category: 'format', x: 19762, y: height - 200, label: 'F' },
            { category: 'contraintes', x: 20165, y: height - 200, label: 'C' }
        ];
        
        // Créer les objets collectables au sol
        improvementPositions.forEach((pos, index) => {
            const categoryData = promptCategories[pos.category];
            if (!categoryData) {
                console.error('Catégorie non trouvée:', pos.category);
                return;
            }
            
            // Les éléments sont dans categoryData.elements
            if (!categoryData.elements || !Array.isArray(categoryData.elements)) {
                console.error('Éléments non trouvés pour la catégorie:', pos.category);
                return;
            }
            
            const element = categoryData.elements[pos.elementIndex];
            if (!element) {
                console.error('Élément non trouvé pour la catégorie:', pos.category, 'index:', pos.elementIndex, 'éléments disponibles:', categoryData.elements.length);
                return;
            }
            
            // Trouver la position correspondante
            const collectablePos = collectablePositions.find(p => p.category === pos.category);
            if (!collectablePos) {
                console.error('Position non trouvée pour la catégorie:', pos.category);
                return;
            }
            
            console.log('Création de l\'élément collectable:', pos.category, 'à la position:', collectablePos.x, collectablePos.y);
            
            // Positionner l'élément au sol
            const elementX = collectablePos.x;
            const elementY = collectablePos.y;
            
            // Indicateur visuel de l'élément (cercle coloré au sol)
            const indicator = scene.add.circle(elementX, elementY, 30, categoryData.color);
            indicator.setStrokeStyle(4, 0xFFFFFF);
            indicator.setDepth(12);
            
            // Animation de pulsation pour l'élément
            scene.tweens.add({
                targets: indicator,
                scale: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Ajouter l'icône de la catégorie dans le cercle
            const iconText = scene.add.text(elementX, elementY, categoryData.icon, {
                fontSize: '32px'
            });
            iconText.setOrigin(0.5, 0.5);
            iconText.setDepth(13);
            
            // Animation de pulsation pour l'icône
            scene.tweens.add({
                targets: iconText,
                scale: 1.2,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Label de la catégorie (C, R, T, F, C) au-dessus du cercle
            const labelText = scene.add.text(elementX, elementY - 50, collectablePos.label, {
                fontSize: '24px',
                fill: '#FFFFFF',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            });
            labelText.setOrigin(0.5, 0.5);
            labelText.setDepth(13);
            
            // Texte de l'élément affiché au-dessus du label
            const displayText = element.text.length > 40 ? element.text.substring(0, 37) + '...' : element.text;
            const elementText = scene.add.text(elementX, elementY - 80, displayText, {
                fontSize: '12px',
                fill: '#FFFFFF',
                fontStyle: 'bold',
                align: 'center',
                wordWrap: { width: 200 },
                maxLines: 2,
                stroke: '#000000',
                strokeThickness: 2
            });
            elementText.setOrigin(0.5, 0.5);
            elementText.setDepth(13);
            
            // Ajouter la physique à l'indicateur (static body pour qu'il ne bouge pas)
            scene.physics.add.existing(indicator, true); // true = static body
            if (indicator.body) {
                indicator.body.setCircle(35); // Zone de collision plus grande
            }
            
            // S'assurer que l'indicateur est visible et actif
            indicator.setVisible(true);
            indicator.setActive(true);
            
            // Stocker les données
            GameState.level7ImprovementData.push({
                improvementIndex: index,
                category: pos.category,
                element: element,
                categoryData: categoryData,
                platformX: elementX,
                platformY: elementY,
                indicator: indicator,
                elementText: elementText,
                iconText: iconText,
                labelText: labelText,
                isCollected: false
            });
        });
        
        // Créer la barrière à la fin du niveau 7
        createLevel7Barrier(scene, level7EndX, height);
        
        // Plus besoin de colliders pour les plateformes puisqu'on n'en a plus
    } catch (error) {
        console.error('Erreur dans createLevel7Platforms:', error);
    }
}

// Créer l'affichage du prompt en construction
function createPromptDisplay(scene, height) {
    if (GameState.level7PromptDisplay) {
        destroyPromptDisplay();
    }
    
    const menuHeight = 60;
    const panelWidth = 600;
    const panelHeight = 400;
    const panelX = panelWidth / 2 + 20; // À gauche de l'écran
    const panelY = menuHeight + 20 + panelHeight / 2;
    
    const promptPanel = scene.add.graphics();
    promptPanel.fillStyle(0x000000, 0.85);
    promptPanel.fillRoundedRect(panelX - panelWidth / 2, panelY - panelHeight / 2, panelWidth, panelHeight, 10);
    promptPanel.setDepth(2500);
    promptPanel.setScrollFactor(0);
    
    // Titre en haut du panneau
    const promptTitle = scene.add.text(panelX, panelY - panelHeight / 2 + 20, "💡 Prompt en construction", {
        fontSize: '18px',
        fill: '#FFFFFF',
        fontStyle: 'bold'
    });
    promptTitle.setOrigin(0.5, 0.5);
    promptTitle.setDepth(2501);
    promptTitle.setScrollFactor(0);
    
    // Score juste en dessous du titre
    const scoreText = scene.add.text(panelX, panelY - panelHeight / 2 + 50, "Qualité: 0%", {
        fontSize: '16px',
        fill: '#FFD700',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
    });
    scoreText.setOrigin(0.5, 0.5);
    scoreText.setDepth(2501);
    scoreText.setScrollFactor(0);
    
    // Texte du prompt en dessous du score (avec espacement)
    const promptText = scene.add.text(panelX - panelWidth / 2 + 15, panelY - panelHeight / 2 + 80, basePrompt, {
        fontSize: '11px',
        fill: '#FFFFFF',
        wordWrap: { width: panelWidth - 30 },
        maxLines: 0,
        align: 'left'
    });
    promptText.setOrigin(0, 0);
    promptText.setDepth(2501);
    promptText.setScrollFactor(0);
    
    // Indicateur CRTF en bas du panneau
    const categoriesText = scene.add.text(panelX, panelY + panelHeight / 2 - 20, "CRTF: 0/5", {
        fontSize: '14px',
        fill: '#10A37F',
        fontStyle: 'bold'
    });
    categoriesText.setOrigin(0.5, 0.5);
    categoriesText.setDepth(2501);
    categoriesText.setScrollFactor(0);
    
    GameState.level7PromptDisplay = {
        panel: promptPanel,
        title: promptTitle,
        scoreText: scoreText,
        promptText: promptText,
        categoriesText: categoriesText
    };
}

// Détruire l'affichage du prompt
function destroyPromptDisplay() {
    try {
        if (GameState.level7PromptDisplay) {
            if (GameState.level7PromptDisplay.panel && GameState.level7PromptDisplay.panel.destroy) {
                GameState.level7PromptDisplay.panel.destroy();
            }
            if (GameState.level7PromptDisplay.title && GameState.level7PromptDisplay.title.destroy) {
                GameState.level7PromptDisplay.title.destroy();
            }
            if (GameState.level7PromptDisplay.scoreText && GameState.level7PromptDisplay.scoreText.destroy) {
                GameState.level7PromptDisplay.scoreText.destroy();
            }
            if (GameState.level7PromptDisplay.promptText && GameState.level7PromptDisplay.promptText.destroy) {
                GameState.level7PromptDisplay.promptText.destroy();
            }
            if (GameState.level7PromptDisplay.categoriesText && GameState.level7PromptDisplay.categoriesText.destroy) {
                GameState.level7PromptDisplay.categoriesText.destroy();
            }
            GameState.level7PromptDisplay = null;
        }
    } catch (error) {
        console.error('Erreur dans destroyPromptDisplay:', error);
        GameState.level7PromptDisplay = null;
    }
}

// Mettre à jour l'affichage du prompt
function updatePromptDisplay(scene) {
    if (GameState.level7PromptDisplay && GameState.currentLevelIndex === 6) {
        const totalCategories = 5;
        const collectedCategories = [...new Set(GameState.collectedImprovements.map(i => i.category))];
        const uniqueCategories = collectedCategories.length;
        const qualityScore = (uniqueCategories / totalCategories) * 100;
        
        GameState.level7PromptDisplay.scoreText.setText(`Qualité: ${Math.round(qualityScore)}%`);
        
        if (qualityScore >= 80) {
            GameState.level7PromptDisplay.scoreText.setFill('#00FF00');
        } else if (qualityScore >= 60) {
            GameState.level7PromptDisplay.scoreText.setFill('#FFD700');
        } else {
            GameState.level7PromptDisplay.scoreText.setFill('#FFA500');
        }
        
        const promptToDisplay = GameState.currentPrompt || basePrompt;
        GameState.level7PromptDisplay.promptText.setText(promptToDisplay);
        
        const categoryLetters = ['C', 'R', 'T', 'F', 'C'];
        const collectedLetters = collectedCategories.map(cat => {
            const index = Object.keys(promptCategories).indexOf(cat);
            return categoryLetters[index] || '';
        }).join('');
        GameState.level7PromptDisplay.categoriesText.setText(`CRTF: ${uniqueCategories}/5 (${collectedLetters})`);
        
        if (uniqueCategories >= 5) {
            GameState.level7PromptDisplay.categoriesText.setFill('#00FF00');
        } else {
            GameState.level7PromptDisplay.categoriesText.setFill('#10A37F');
        }
    }
}

// Construire le prompt à partir des améliorations collectées
function buildPrompt() {
    const order = ['contexte', 'role', 'taches', 'format', 'contraintes'];
    const promptParts = [];
    const labels = ['C — CONTEXTE', 'R — RÔLE', 'T — TÂCHES', 'F — FORMAT', 'C — CONTRAINTES'];
    
    order.forEach((category, index) => {
        const improvements = GameState.collectedImprovements.filter(i => i.category === category);
        if (improvements.length > 0) {
            const element = improvements[0].element;
            promptParts.push(`${labels[index]}\n${element.value}`);
        } else {
            promptParts.push(`${labels[index]}\n[À collecter]`);
        }
    });
    
    let prompt = promptParts.join('\n\n');
    
    if (GameState.collectedImprovements.length === 0) {
        prompt = basePrompt + '\n\n' + labels.join('\n[À collecter]\n\n');
    }
    
    GameState.currentPrompt = prompt;
}

// Vérification manuelle de collision avec les éléments d'amélioration
function checkImprovementCollection(scene) {
    if (!GameState.player || !GameState.level7ImprovementData || GameState.level7ImprovementData.length === 0) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const detectionRadius = 80; // Augmenté pour faciliter la collecte
    
    GameState.level7ImprovementData.forEach(improvementData => {
        if (improvementData.isCollected || !improvementData.indicator) {
            return;
        }
        
        // Vérifier que l'indicateur existe et est actif
        if (!improvementData.indicator || !improvementData.indicator.active) {
            return;
        }
        
        const indicatorX = improvementData.indicator.x;
        const indicatorY = improvementData.indicator.y;
        
        // Calculer la distance entre le joueur et l'élément
        const distance = Math.sqrt(
            Math.pow(playerX - indicatorX, 2) + Math.pow(playerY - indicatorY, 2)
        );
        
        if (distance < detectionRadius) {
            console.log('✅ COLLISION DÉTECTÉE avec l\'élément', improvementData.category, 'distance:', distance);
            collectImprovement(scene, improvementData);
        }
    });
}

// Collecter une amélioration
function collectImprovement(scene, improvementData) {
    if (improvementData.isCollected) {
        return;
    }
    
    console.log('📝 Collecte de l\'amélioration', improvementData.element.text, 'réussie !');
    
    improvementData.isCollected = true;
    GameState.collectedImprovements.push({
        category: improvementData.category,
        element: improvementData.element,
        categoryData: improvementData.categoryData
    });
    
    scene.tweens.add({
        targets: [improvementData.indicator, improvementData.iconText, improvementData.elementText, improvementData.labelText],
        y: improvementData.indicator.y - 100,
        scale: 1.5,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => {
            if (improvementData.indicator) improvementData.indicator.destroy();
            if (improvementData.iconText) improvementData.iconText.destroy();
            if (improvementData.elementText) improvementData.elementText.destroy();
            if (improvementData.labelText) improvementData.labelText.destroy();
        }
    });
    
    createImprovementParticles(scene, improvementData.indicator.x, improvementData.indicator.y, improvementData.categoryData.color);
    
    buildPrompt();
    updatePromptDisplay(scene);
    
    const collectedCategories = [...new Set(GameState.collectedImprovements.map(i => i.category))];
    if (collectedCategories.length >= 5) {
        removeBarrier(scene);
    }
}

// Créer des particules pour la collecte
function createImprovementParticles(scene, x, y, color) {
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

// Créer la barrière à la fin du niveau 7
function createLevel7Barrier(scene, barrierX, height) {
    if (GameState.level7Barrier) {
        GameState.level7Barrier.destroy();
    }
    
    GameState.level7Barrier = scene.add.rectangle(barrierX - 25, height / 2, 100, height + 200, 0xFF0000, 0.5);
    GameState.level7Barrier.setDepth(100);
    scene.physics.add.existing(GameState.level7Barrier, true); // true = static body (déjà immobile)
    
    if (GameState.level7Barrier.body) {
        // Les static bodies sont déjà immobiles, pas besoin de setImmovable
        GameState.level7Barrier.body.setSize(100, height + 200);
    }
}

// Afficher un message si le joueur essaie de passer sans un prompt complet
function showBarrierMessage(scene, x, y) {
    if (GameState.level7BarrierMessage) {
        GameState.level7BarrierMessage.destroy();
    }
    
    const collectedCategories = [...new Set(GameState.collectedImprovements.map(i => i.category))];
    const uniqueCategories = collectedCategories.length;
    const qualityScore = (uniqueCategories / 5) * 100;
    
    const message = scene.add.text(x, y - 100, `Vous devez collecter\ntoutes les 5 catégories CRTF\n(${uniqueCategories}/5 catégories, ${Math.round(qualityScore)}% qualité)`, {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
    });
    message.setOrigin(0.5, 0.5);
    message.setDepth(2500);
    
    GameState.level7BarrierMessage = message;
    
    scene.time.delayedCall(3000, () => {
        if (GameState.level7BarrierMessage) {
            scene.tweens.add({
                targets: message,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    message.destroy();
                    GameState.level7BarrierMessage = null;
                }
            });
        }
    });
}

// Retirer la barrière quand le prompt est complet
function removeBarrier(scene) {
    if (GameState.level7Barrier) {
        scene.tweens.add({
            targets: GameState.level7Barrier,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                GameState.level7Barrier.destroy();
                GameState.level7Barrier = null;
                if (GameState.level7BarrierCollider) {
                    GameState.level7BarrierCollider.destroy();
                    GameState.level7BarrierCollider = null;
                }
            }
        });
    }
}

// Réinitialiser le niveau 7
function resetLevel7() {
    try {
        if (GameState.level7ImprovementData) {
            GameState.level7ImprovementData.forEach(data => {
                if (data.indicator && data.indicator.destroy) {
                    data.indicator.destroy();
                }
                if (data.iconText && data.iconText.destroy) {
                    data.iconText.destroy();
                }
                if (data.elementText && data.elementText.destroy) {
                    data.elementText.destroy();
                }
                if (data.labelText && data.labelText.destroy) {
                    data.labelText.destroy();
                }
            });
        }
        
        if (GameState.level7Prisons && GameState.level7Prisons.length > 0) {
            GameState.level7Prisons.forEach(prison => {
                if (prison.labelText && prison.labelText.destroy) {
                    prison.labelText.destroy();
                }
            });
            GameState.level7Prisons = [];
        }
        
        GameState.collectedImprovements = [];
        GameState.level7ImprovementData = [];
        GameState.currentPrompt = basePrompt;
        
        if (GameState.level7Platforms && GameState.level7Platforms.children) {
            GameState.level7Platforms.clear(true, true);
        }
        
        if (GameState.level7Barrier) {
            if (GameState.level7Barrier.destroy) {
                GameState.level7Barrier.destroy();
            }
            GameState.level7Barrier = null;
        }
        
        if (GameState.level7Collider) {
            if (GameState.level7Collider.destroy) {
                GameState.level7Collider.destroy();
            }
            GameState.level7Collider = null;
        }
        if (GameState.level7BarrierCollider) {
            if (GameState.level7BarrierCollider.destroy) {
                GameState.level7BarrierCollider.destroy();
            }
            GameState.level7BarrierCollider = null;
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du niveau 7:', error);
    }
}

// Gérer les interactions avec les plateformes du niveau 7
export function handleLevel7Platforms(scene) {
    try {
        if (GameState.currentLevelIndex === 6) {
            if (!GameState.level7Platforms || GameState.level7ImprovementData.length === 0) {
                createLevel7Platforms(scene, scene.scale.width, scene.scale.height);
            }
            
            if (!GameState.level7PromptDisplay) {
                createPromptDisplay(scene, scene.scale.height);
            }
            
            if (GameState.player) {
                if (GameState.level7Platforms && GameState.level7Platforms.children.size > 0) {
                    if (!GameState.level7Collider) {
                        GameState.level7Collider = scene.physics.add.collider(GameState.player, GameState.level7Platforms);
                    }
                }
                
                if (GameState.level7Barrier && !GameState.level7BarrierCollider) {
                    GameState.level7BarrierCollider = scene.physics.add.collider(
                        GameState.player,
                        GameState.level7Barrier,
                        (player, barrier) => {
                            const collectedCategories = [...new Set(GameState.collectedImprovements.map(i => i.category))];
                            const uniqueCategories = collectedCategories.length;
                            
                            if (uniqueCategories < 5) {
                                showBarrierMessage(scene, barrier.x, scene.scale.height / 2);
                                
                                if (player.x >= barrier.x - 50) {
                                    player.setX(Math.min(player.x, barrier.x - 60));
                                    player.setVelocityX(0);
                                }
                            }
                        }
                    );
                }
                
                if (GameState.player.x >= GameState.level7Barrier.x - 50) {
                    const collectedCategories = [...new Set(GameState.collectedImprovements.map(i => i.category))];
                    const uniqueCategories = collectedCategories.length;
                    
                    if (uniqueCategories < 5) {
                        GameState.player.setX(GameState.level7Barrier.x - 60);
                        GameState.player.setVelocityX(0);
                    }
                }
            }
            
            // Vérifier la collecte des éléments (toujours, même si le tableau est vide au début)
            if (GameState.player) {
                checkImprovementCollection(scene);
            }
            
            updatePromptDisplay(scene);
        } else {
            if (GameState.level7PromptDisplay) {
                destroyPromptDisplay();
            }
        }
    } catch (error) {
        console.error('Erreur dans handleLevel7Platforms:', error);
    }
}

// Détruire les éléments du niveau 7
export function destroyLevel7() {
    resetLevel7();
    destroyPromptDisplay();
}

