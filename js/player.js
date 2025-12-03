import { GameState } from './gameState.js';

// Création et gestion du joueur
export function createPlayer(scene) {
    const height = scene.scale.height;
    
    // Vérifier que le sol existe
    if (!GameState.ground) {
        console.error('Le sol n\'existe pas encore !');
        return;
    }
    
    // Créer le joueur (position initiale ajustée - plus haut pour éviter le blocage)
    GameState.player = scene.physics.add.sprite(100, height - 180, 'player');
    GameState.player.setBounce(0.2);
    GameState.player.setCollideWorldBounds(true); // Collision avec toutes les limites
    GameState.player.setDepth(70); // Joueur au premier plan, au-dessus de l'herbe et des nuages
    
    // Désactiver la friction pour un mouvement linéaire et constant
    GameState.player.setDrag(0, 0);
    GameState.player.setFriction(0, 0);
    
    // Collision entre le joueur et le sol
    scene.physics.add.collider(GameState.player, GameState.ground);
    
    // Configurer la caméra pour suivre le joueur
    const width = scene.scale.width;
    scene.cameras.main.setBounds(0, 0, GameState.worldWidth, height);
    scene.cameras.main.startFollow(GameState.player, true, 0.1, 0.1);
    scene.cameras.main.setDeadzone(width * 0.3, height * 0.3);
    
    // Contrôles clavier
    GameState.cursors = scene.input.keyboard.createCursorKeys();
    
    console.log('Joueur créé à la position:', GameState.player.x, GameState.player.y);
    console.log('Sol créé:', GameState.ground.children.size, 'tuiles');
}

// Mise à jour du mouvement du joueur
export function updatePlayer() {
    // Vérifier que le joueur et les contrôles existent
    if (!GameState.player || !GameState.cursors) {
        return;
    }
    
    // Vérifier si le joueur est au sol pour permettre le saut
    const isOnGround = GameState.player.body.touching.down || 
                      (GameState.player.body.velocity.y === 0 && GameState.player.body.blocked.down);
    if (isOnGround) {
        GameState.canJump = true;
    }
    
    // Vélocité horizontale constante et linéaire (même vitesse en l'air et au sol) - 3x plus rapide
    const horizontalSpeed = 1200; // Vitesse constante et contrôlée (3x plus rapide)
    
    // Empêcher le mouvement si on est bloqué contre un mur
    if (GameState.cursors.left.isDown && !GameState.player.body.blocked.left) {
        GameState.player.setVelocityX(-horizontalSpeed);
    } else if (GameState.cursors.right.isDown && !GameState.player.body.blocked.right) {
        GameState.player.setVelocityX(horizontalSpeed);
    } else {
        GameState.player.setVelocityX(0);
    }
    
    // Saut linéaire avec vélocité verticale très rapide - monte et descend très rapidement
    if (GameState.cursors.up.isDown && GameState.canJump && isOnGround) {
        GameState.player.setVelocityY(-900); // Saut très rapide pour monter rapidement
        GameState.canJump = false;
    }
}

