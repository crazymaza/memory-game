import Phaser from "phaser";

export default class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value, suit) {
        super(scene, 0, 0, 'back');
        this.scene = scene;
        this.value = value;
        this.suit = suit;
        this.scene.add.existing(this);
        this.setInteractive();
        this.opened = false;
    }

    init(position) {
        this.position = position;
        this.close();
        this.setPosition(-this.width, -this.height);
    }

    move(params) {
        this.scene.tweens.add({
            targets: this,
            x: params.x,
            y: params.y,
            ease: 'Linear',
            duration: 300,
            delay: params.delay,
            onComplete: () => {
                if(params.callback) {
                    params.callback();
                }
            }
        })
    }

    open() {
        this.opened = true;
        this.flip(`${this.suit}${this.value}`);
    }

    close() {
        this.opened = false;
        this.flip('back');
    }

    flip(texture) {
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            ease: 'Linear',
            duration: 150,
            onComplete: () => {
                this.show(texture);
            }
        })
    }

    show(texture) {
        this.setTexture(texture);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            ease: 'Linear',
            duration: 150
        })
    }
}