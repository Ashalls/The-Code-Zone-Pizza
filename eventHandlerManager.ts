class EventHandlerManager {
    constructor() {
        this.initialiseSpriteOverlaps();
        this.initialiseTileOverlaps();
        // GH1
        this.initialiseWallOverlaps();
        // --GH1
    }

    private initialiseSpriteOverlaps(): void {
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, (playerSprite: PlayerSprite, enemy: EnemySprite) => {
            // GH2
            // if (playerSprite.stance == enemy.stance) {
            //     playerSprite.vx -= 25;
            //     enemy.vx += 25;
            //     scene.cameraShake(2, 100);
            // } else if (playerSprite.attacking) {
            //     enemy.destroy();
            // } else {
            //     game.over(false);
            // }
            if (playerSprite.parrying && !enemy.stunned) {
                enemy.stun();
            }
            else if (playerSprite.stance == enemy.stance) {
                playerSprite.vx -= 25;
                enemy.vx += 25;
                scene.cameraShake(2, 100);
            } else if (playerSprite.attacking) {
                enemy.destroy();
            } else if (!enemy.stunned) {
                game.over(false);
            }
            // --GH2
        });

        // GH1
        const daggerOverlap = (duelist: Duelist, dagger: Dagger) => {
            if(duelist.attacking) {
                dagger.rebound();
            } else if (duelist.kind() == SpriteKind.Enemy) {
                duelist.destroy();
            } else {
                game.over(false);
            }
        }
        sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, daggerOverlap)
        sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, daggerOverlap)
        // --GH1
    }

    private initialiseTileOverlaps(): void {
        scene.onOverlapTile(SpriteKind.Player, assets.tile`end`, (playerSprite: PlayerSprite, location: tiles.Location) => {
            game.over(true);
        });
    }

    // GH1
    private initialiseWallOverlaps(): void {
        scene.onHitWall(SpriteKind.Projectile, (projectile: Dagger, location: tiles.Location) => {
            projectile.destroy();
        });
    }
    // --GH1
}