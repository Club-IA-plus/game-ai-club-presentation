import { levels } from './config.js';
import { GameState } from './gameState.js';

// Configuration du serpent
const snakeConfig = {
    speed: 300, // Vitesse de déplacement (assez rapide)
    segmentSize: 40, // Taille de chaque segment
    initialLength: 8, // Longueur initiale du serpent
    color: 0x00FF00, // Vert pour le corps
    headColor: 0xFF0000 // Rouge pour la tête
};

let snakes = []; // Tableau pour stocker les 7 serpents

// Créer un serpent individuel
function createSingleSnake(scene, startX, startY, initialDirection) {
    const snakeSegments = [];
    const snakePath = [];
    
    // Créer la tête du serpent
    const head = scene.add.rectangle(startX, startY, snakeConfig.segmentSize, snakeConfig.segmentSize, snakeConfig.headColor);
    head.setDepth(100); // Au-dessus de la plupart des éléments
    snakeSegments.push(head);
    
    // Créer les segments du corps
    for (let i = 1; i < snakeConfig.initialLength; i++) {
        const segment = scene.add.rectangle(
            startX - (i * snakeConfig.segmentSize * initialDirection.x),
            startY - (i * snakeConfig.segmentSize * initialDirection.y),
            snakeConfig.segmentSize,
            snakeConfig.segmentSize,
            snakeConfig.color
        );
        segment.setDepth(100);
        snakeSegments.push(segment);
    }
    
    // Initialiser le chemin
    snakeSegments.forEach((segment) => {
        snakePath.push({ x: segment.x, y: segment.y });
    });
    
    return {
        segments: snakeSegments,
        direction: { x: initialDirection.x, y: initialDirection.y },
        path: snakePath
    };
}

// Création des 7 serpents pour le niveau 4
export function createLevel4Snake(scene) {
    // Niveau 4 : Séance Waouh 3 - Découverte du code (Cursor)
    const level4 = levels[3]; // Index 3 pour le niveau 4
    const level4StartX = level4.startX;
    const level4EndX = level4.endX;
    const level4Width = level4EndX - level4StartX;
    const height = scene.scale.height;
    
    // Créer 7 serpents avec des positions et directions différentes
    snakes = [];
    const numSnakes = 7;
    
    for (let i = 0; i < numSnakes; i++) {
        // Répartir les serpents dans différentes zones du niveau
        const progress = i / (numSnakes - 1); // 0 à 1
        const startX = level4StartX + level4Width * (0.1 + progress * 0.7);
        const startY = height * (0.15 + (i % 3) * 0.25); // Répartir verticalement
        
        // Directions initiales variées
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 0.7, y: 0.7 },
            { x: -0.7, y: 0.7 },
            { x: 0.7, y: -0.7 }
        ];
        
        const initialDirection = directions[i % directions.length];
        const snake = createSingleSnake(scene, startX, startY, initialDirection);
        
        // Ajouter les informations du niveau
        snake.level4StartX = level4StartX;
        snake.level4EndX = level4EndX;
        snake.level4Width = level4Width;
        snake.scene = scene;
        
        snakes.push(snake);
    }
}

// Mettre à jour le mouvement d'un serpent individuel
function updateSingleSnake(snake) {
    if (!snake || !GameState.player) {
        return;
    }
    
    const scene = snake.scene;
    const height = scene.scale.height;
    const delta = scene.game.loop.delta; // Delta time en millisecondes
    
    // Calculer la nouvelle position de la tête
    const head = snake.segments[0];
    
    // Vérifier les limites du niveau 4
    const level4StartX = snake.level4StartX;
    const level4EndX = snake.level4EndX;
    const margin = snakeConfig.segmentSize * 2;
    
    // Changer de direction si on atteint les bords
    if (head.x <= level4StartX + margin) {
        snake.direction.x = 1; // Aller vers la droite
        snake.direction.y = (Math.random() - 0.5) * 0.3; // Légère variation verticale
    } else if (head.x >= level4EndX - margin) {
        snake.direction.x = -1; // Aller vers la gauche
        snake.direction.y = (Math.random() - 0.5) * 0.3; // Légère variation verticale
    }
    
    if (head.y <= margin) {
        snake.direction.y = 0.5; // Aller vers le bas
        snake.direction.x = (Math.random() - 0.5) * 0.5; // Légère variation horizontale
    } else if (head.y >= height - margin) {
        snake.direction.y = -0.5; // Aller vers le haut
        snake.direction.x = (Math.random() - 0.5) * 0.5; // Légère variation horizontale
    }
    
    // Normaliser la direction pour un mouvement fluide
    const magnitude = Math.sqrt(snake.direction.x ** 2 + snake.direction.y ** 2);
    if (magnitude > 0) {
        snake.direction.x = (snake.direction.x / magnitude);
        snake.direction.y = (snake.direction.y / magnitude);
    }
    
    // Calculer la nouvelle position avec le delta time
    const speed = snakeConfig.speed * (delta / 1000); // Convertir en pixels par frame
    const finalX = head.x + (snake.direction.x * speed);
    const finalY = head.y + (snake.direction.y * speed);
    
    // Ajouter la nouvelle position au chemin
    snake.path.push({ x: finalX, y: finalY });
    
    // Déplacer chaque segment vers la position du segment précédent dans le chemin
    for (let i = snake.segments.length - 1; i > 0; i--) {
        const currentSegment = snake.segments[i];
        // Utiliser le chemin avec un décalage basé sur l'index du segment
        const pathIndex = snake.path.length - (snake.segments.length - i) * 3 - 1;
        if (pathIndex >= 0 && pathIndex < snake.path.length) {
            currentSegment.x = snake.path[pathIndex].x;
            currentSegment.y = snake.path[pathIndex].y;
        } else if (i > 0) {
            // Fallback : suivre le segment précédent
            const previousSegment = snake.segments[i - 1];
            currentSegment.x = previousSegment.x;
            currentSegment.y = previousSegment.y;
        }
    }
    
    // Déplacer la tête
    head.x = finalX;
    head.y = finalY;
    
    // Limiter la taille du chemin pour éviter qu'il devienne trop grand
    const maxPathLength = snake.segments.length * 5;
    if (snake.path.length > maxPathLength) {
        snake.path.shift();
    }
}

// Mettre à jour le mouvement de tous les serpents
export function updateLevel4Snake(scene) {
    if (!GameState.player || GameState.currentLevelIndex !== 3) {
        // Si on n'est plus sur le niveau 4, détruire les serpents
        if (snakes.length > 0) {
            destroyLevel4Snake();
        }
        return;
    }
    
    // Si on est sur le niveau 4 mais qu'il n'y a pas de serpents, les créer
    if (snakes.length === 0) {
        createLevel4Snake(scene);
    }
    
    // Mettre à jour chaque serpent
    snakes.forEach(snake => {
        updateSingleSnake(snake);
    });
    
    // Vérifier la collision avec le joueur pour tous les serpents
    checkSnakeCollision();
}

// Vérifier la collision entre tous les serpents et le joueur
function checkSnakeCollision() {
    if (snakes.length === 0 || !GameState.player) {
        return;
    }
    
    const playerX = GameState.player.x;
    const playerY = GameState.player.y;
    const playerWidth = GameState.player.width;
    const playerHeight = GameState.player.height;
    
    // Vérifier la collision avec chaque serpent
    snakes.forEach(snake => {
        // Vérifier la collision avec chaque segment de chaque serpent
        snake.segments.forEach((segment) => {
            const segmentX = segment.x;
            const segmentY = segment.y;
            const segmentSize = snakeConfig.segmentSize;
            const halfSize = segmentSize / 2;
            
            // Détection de collision simple (rectangle) avec une marge de sécurité
            const collisionMargin = 5;
            if (playerX + playerWidth / 2 - collisionMargin >= segmentX - halfSize &&
                playerX - playerWidth / 2 + collisionMargin <= segmentX + halfSize &&
                playerY + playerHeight / 2 - collisionMargin >= segmentY - halfSize &&
                playerY - playerHeight / 2 + collisionMargin <= segmentY + halfSize) {
                
                // Collision détectée ! Réinitialiser le joueur au début du niveau
                resetPlayerToLevelStart(snake.scene);
                return; // Sortir de la boucle pour éviter plusieurs réinitialisations
            }
        });
    });
}

// Réinitialiser le joueur au début du niveau 4
function resetPlayerToLevelStart(scene) {
    if (!GameState.player) {
        return;
    }
    
    const level4 = levels[3];
    const height = scene.scale.height;
    
    // Position de départ du niveau 4
    const startX = level4.startX + 100;
    const startY = height - 180; // Même hauteur que la position initiale
    
    // Réinitialiser la position du joueur
    GameState.player.x = startX;
    GameState.player.y = startY;
    
    // Réinitialiser la vélocité
    GameState.player.setVelocity(0, 0);
    
    // Réinitialiser la caméra
    scene.cameras.main.startFollow(GameState.player, true, 0.1, 0.1);
    
    // Effet visuel pour indiquer la réinitialisation
    scene.cameras.main.flash(500, 255, 0, 0); // Flash rouge
}

// Nettoyer tous les serpents quand on quitte le niveau
export function destroyLevel4Snake() {
    if (snakes && snakes.length > 0) {
        snakes.forEach(snake => {
            if (snake && snake.segments) {
                snake.segments.forEach(segment => {
                    if (segment && segment.destroy) {
                        segment.destroy();
                    }
                });
            }
        });
        snakes = [];
    }
}

