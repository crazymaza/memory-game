import Phaser from 'phaser'

import GameScene from './GameScene.js'

export const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	rows: 2,
	coll: 5,
	cardsValues: [2, 3, 4, 5, 6],
	cardSuits: ['clubs', 'diamonds'],
	scene: [GameScene],
}

export default new Phaser.Game(config)
