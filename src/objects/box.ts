import {Collectible} from "./collectible";

export class Box extends Phaser.GameObjects.Sprite {
    // variables
    public currentScene: Phaser.Scene;
    public boxContent: string;
    private content: Collectible;
    private hitBoxTimeline: Phaser.Tweens.Timeline;

    getContent(): Phaser.GameObjects.Sprite {
        return this.content;
    }


    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // variables
        this.currentScene = params.scene;
        this.boxContent = params.content;

        this.initSprite();
        this.currentScene.add.existing(this);
    }

    private initSprite() {
        // variables
        this.content = null;
        this.hitBoxTimeline = this.currentScene.tweens.createTimeline({});

        // sprite
        this.setOrigin(0, 0);
        this.setFrame(0);

        // physics
        this.currentScene.physics.world.enable(this);
        this.body.setSize(8, 8);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }

    spawnBoxContent(): Collectible {
        return this.content = new Collectible({scene: this.currentScene, x: this.x, y: this.y - 8, key: this.boxContent, points: 1000});
    }

    yoyoTheBoxUpAndDown(): void {
        this.hitBoxTimeline.add({
            targets: this, props: {y: this.y - 10}, duration: 60, ease: "Power0", yoyo: true,
            onComplete: function () {
                this.targets[0].active = false;
                this.targets[0].setFrame(1);
            }
        });
    }

    popUpCollectible(): void {
        this.content.body.setVelocity(30, -50);
        this.content.body.setAllowGravity(true);
        this.content.body.setGravityY(-300);
    }

    startHitTimeline(): void {
        this.hitBoxTimeline.play();
    }

    tweenBoxContent(props: {}, duration: number, complete: () => void): void {
        this.scene.sound.play('coin');
        this.hitBoxTimeline.add({targets: this.content, props: props, delay: 0, duration: duration, ease: "Power0", onComplete: complete});
    }

    addCoinAndScore(coin: number, score: number): void {
        this.currentScene.registry.values.coins += coin;
        this.currentScene.events.emit("coinsChanged");
        this.currentScene.registry.values.score += score;
        this.currentScene.events.emit("scoreChanged");
    }

    update(): void {}

}