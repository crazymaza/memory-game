import Phaser from 'phaser'
import Card from "./Card.js";
import {config} from "./main.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.load.image('back', 'img/cardBack.png');

        for (const suit of config.cardSuits) {
            for (const value of config.cardsValues) {
                const cardName = `${suit}${value}`;
                this.load.image(cardName, `img/${cardName}.png`);
            }
        }
        this.load.image('bg', 'img/bg.jpg');
    }

    create() {
        this.createBackground();
        this.createCard();
        this.restart();
    }

    restart() {
        let count = 0;
        const onCardMoveComplete = () => {
            ++count;
            if(count >= this.cards.length) {
                this.start();
            }
        }
        this.cards.forEach(card => {
            card.move({
                x: config.width + card.width,
                y: config.height + card.height,
                delay: card.position?.delay,
                callback: onCardMoveComplete,
            });
        })
    }

    start() {
        this.openedCard = null;
        this.openedCardsCount = 0;
        this.cardPositions = this.initCardsPositions();
        this.initCards();
        this.showCards();
    }

    initCards() {
        const cardsPositions = Phaser.Utils.Array.Shuffle(this.cardPositions);
        this.cards.forEach(card => {
            card.init(cardsPositions.pop());
        })
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay;
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            });
        })
    }

    createBackground() {
        this.add.image(400, 300, 'bg').setOrigin(0.5, 0.5).setScale(1.5);
    }

    createCard() {
        this.cards = [];
        for (const cardValue of config.cardsValues) {
            for (let i = 0; i < 2; i += 1) {
                this.cards.push(new Card(this, cardValue, config.cardSuits[0]));
            }
        }

        this.input.on('gameobjectdown', this.onCardClicked, this);
    }

    onCardClicked(_, card) {
        if (card.opened) {
            return false;
        }
        if (this.openedCard) {
            if (this.openedCard?.value === card.value) {
                this.openedCard = null;
                ++this.openedCardsCount;
            } else {
                this.openedCard.close();
                this.openedCard = card;
            }
        } else {
            this.openedCard = card;
        }
        card.open();

        if (this.openedCardsCount === config.coll) {
            this.restart();
        }
    }

    initCardsPositions() {
        const cardTexture = this.textures.get('back').getSourceImage();
        const cardWidth = cardTexture.width + 4;
        const cardHeight = cardTexture.height + 4;
        const offsetX = (this.sys.game.config.width - cardWidth * config.coll) / 2 + cardWidth / 2;
        const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardWidth / 2;
        const positions = [];

        let id = 0;

        for (let row = 0; row < config.rows; row++) {
            for (let coll = 0; coll < config.coll; coll++) {
                positions.push({
                    x: offsetX + coll * cardWidth,
                    y: offsetY + row * cardHeight,
                    delay: ++id * 100,
                });
            }
        }

        return positions;
    }
}
