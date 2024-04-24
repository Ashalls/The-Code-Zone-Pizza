abstract class Duelist extends sprites.ExtendableSprite {
    protected images: Image[];
    protected animations: Image[][];
    public attacking: boolean = false;
    public stance: number = 0;
    // GH2
    public stunned: boolean = false;
    public parrying: boolean = false;
    // --GH2

    constructor(spriteKind: number, images: Image[], animations: Image[][]) {
        super(images[0], spriteKind);
        this.images = images
        this.animations = animations;
    }

    protected setStance(stance: number): void {
        this.stance = stance;
        this.setImage(this.images[stance]);
    }

    protected heightenStance(): void {
        let newStance = this.stance + 1;
        if (newStance < 3) {
            this.setStance(newStance);
        }
    }

    protected lowerStance(): void {
        let newStance = this.stance - 1;
        if (newStance > -1) {
            this.setStance(newStance)
        }
    }

    protected attack(): void {
        this.attacking = true;
        animation.runImageAnimation(this, this.animations[this.stance], 40, false);
        timer.after(400, () => {
            this.resetStance();
        })
    }

    protected resetStance(): void {
        this.setImage(this.images[this.stance])
        this.attacking = false;
        // GH2
        this.stunned = false;
        this.parrying = false;
        // --GH2
    }

    // GH2
    public stun(): void {
        this instanceof EnemySprite? this.vx = 20: this.vx = -20;
        this.sayText("!", 3000);
        timer.after(3000, () => {
            this.resetStance();
        })
    }
    // --GH2
}

class PlayerSprite extends Duelist {
    readonly deceleration: number = 0.95
    private speed: number = 8;

    constructor(images: Image[], animations: Image[][]) {
        super(SpriteKind.Player, images, animations);
        this.registerControls();
    }

    private registerControls(): void {
        controller.up.onEvent(ControllerButtonEvent.Pressed, () => {
            this.heightenStance();
        });
        controller.down.onEvent(ControllerButtonEvent.Pressed, () => {
            this.lowerStance();
        });
        controller.A.onEvent(ControllerButtonEvent.Pressed, () => {
            this.attack();
        });
        // GH1
        controller.B.onEvent(ControllerButtonEvent.Pressed, () => {
            timer.throttle("throw dagger", 2000, () => {
                new Dagger(this);
            });
        });
        // --GH1
        // GH2
        controller.combos.attachCombo("a+l", () => {
            this.parrying = true;
            animation.runImageAnimation(this, assets.animation`orange parry`, 40, false);
            timer.after(320, () => {
                this.resetStance();
            })
        })
        // --GH2
    }

    private movement(): void {
        if (controller.right.isPressed()) {
            this.vx += this.speed
        } else if (controller.left.isPressed()) {
            this.vx -= this.speed
        }
        this.vx *= this.deceleration
    }

    public behaviour() {
        this.movement()
        // GH2
        if (this.parrying) {
            return;
        }
        // --GH2
        if (this.attacking) {
            return;
        }
        if (controller.A.isPressed()) {
            this.attack()
        }
    }
}

class EnemySprite extends Duelist {
    readonly maxSpeed: number = -75;

    constructor(playerStance: number, images: Image[], animations: Image[][]) {
        super(SpriteKind.Enemy, images, animations);
        this.setStance(playerStance);
    }

    private randomiseStance(): void {
        switch (this.stance) {
            case 0:
                this.heightenStance();
                break;
            case 1:
                randint(1, 2) == 1 ? this.heightenStance() : this.lowerStance();
                break;
            case 2:
                this.lowerStance();
                break;
            default:
                throw "Invalid stance on enemy";
        }
    }

    public behaviour() {
        // GH2
        if (this.stunned) {
            return;
        }
        // --GH2
        if (this.vx > this.maxSpeed) {
            this.vx -= 0.5;
        }
        if (!this.attacking) {
            if (randint(1, 60) == 1) {
                this.attack();
            }
            if (randint(1, 60) == 1) {
                this.randomiseStance();
            }
        }
    }
}