/*
	Game Script
*/
console.log('Loaded game script');

// Loading External Files
import config from './config.js';
import GameScene from './gameScene.js';

//let game = new Phaser.Game(config);

class Game extends Phaser.Game {
	constructor() {
		super(config);

		// Scene reference, gameScene
		this.scene.add('Game', GameScene);
		this.scene.start('Game');
	}
}

// On Window Load
window.onload = () => {
	// Creates instance of game class
	window.game = new Game();
};