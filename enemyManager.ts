class EnemyManager {
    private enemyImages: Image[] = [
        assets.image`red low`,
        assets.image`red mid`,
        assets.image`red high`
    ];
    private enemyAnimations: Image[][] = [
        assets.animation`red attack low`,
        assets.animation`red attack mid`,
        assets.animation`red attack high`
    ];
    private playerSprite: PlayerSprite;

    constructor(playerSprite: PlayerSprite) {
        this.playerSprite = playerSprite;
    }

    public spawnEnemy(): void {
        if (sprites.allOfKind(SpriteKind.Enemy).length < 3) {
            let enemy = new EnemySprite(this.playerSprite.stance, this.enemyImages, this.enemyAnimations);
            enemy.setPosition(this.playerSprite.x + 110, this.playerSprite.y)
        }
    }

    public enemyBehaviour(): void {
        sprites.allOfKind(SpriteKind.Enemy).forEach((enemy: EnemySprite) => {
            enemy.behaviour();
        })
    }
}