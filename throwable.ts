// GH1
interface Throwable {
    speed: number
}

class Dagger extends sprites.ExtendableSprite implements Throwable {
    public speed: number = 150

    constructor(originSprite: Sprite) {
        super(image.create(16, 16), SpriteKind.Projectile);
        this.setPosition(originSprite.right, originSprite.y);
        this.vx = this.speed;
        animation.runImageAnimation(this, assets.animation`throwing dagger`, 50, true);
    }

    public rebound(): void {
        this.vx *= -1.25;
    }
}
// --GH1