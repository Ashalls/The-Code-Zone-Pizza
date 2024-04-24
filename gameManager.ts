class GameManager {
    private playerSprite: PlayerSprite;
    private enemyManager: EnemyManager;

    constructor() {
        this.setupLevel();
        this.initialisePlayer();
        this.enemyManager = new EnemyManager(this.playerSprite);
        new EventHandlerManager();
        this.onUpdateIntervals();
        this.onUpdates();
    }

    private setupLevel(): void {
        tiles.setCurrentTilemap(assets.tilemap`level`)
        scene.setBackgroundColor(9);
    }

    private initialisePlayer(): void {
        let playerImages = [
            assets.image`orange low`,
            assets.image`orange mid`,
            assets.image`orange high`
        ];
        let playerAnimations = [
            assets.animation`orange attack low`,
            assets.animation`orange attack mid`,
            assets.animation`orange attack high`
        ];
        this.playerSprite = new PlayerSprite(playerImages, playerAnimations);
        scene.cameraFollowSprite(this.playerSprite);
        tiles.placeOnRandomTile(this.playerSprite, assets.tile`orange spawn`);
    }

    private onUpdateIntervals(): void {
        game.onUpdateInterval(1500, () => {
            this.enemyManager.spawnEnemy();
        })
    }

    private onUpdates(): void {
        game.onUpdate(() => {
            this.playerSprite.behaviour();
            this.enemyManager.enemyBehaviour();
        });
    }
}
