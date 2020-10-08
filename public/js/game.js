/*
	Game Script
*/
console.log('Loaded game script');

// Loading External Files
import config from './config.js';
import GameScene from './gameScene.js';
import BootScene from './boot.js';
import LoadScene from './load.js';
import TitleScene from './title.js';
import UIScene from './ui.js';

//let game = new Phaser.Game(config);

class Game extends Phaser.Game {
	constructor() {
		super(config);

		// Add scenes (Key, Scene)
		this.scene.add('Game', GameScene);
		this.scene.add('Boot', BootScene);
		this.scene.add('Load', LoadScene);
		this.scene.add('Title', TitleScene);
		this.scene.add('UI', UIScene);

		// Initial start
		this.scene.start('Boot');
	}
}

// On Window Load
window.onload = () => {
	// Creates instance of game class
	window.game = new Game();
};