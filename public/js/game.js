/*
	Game Script
*/
console.log('Loaded game script');

// Loading External Files
import config from './forest/config/config.js';
import GameScene from './scene/gameScene.js';
import WaterScene from './scene/waterScene.js';
import VillageScene from './scene/villageScene.js';
import BootScene from './scene/boot.js';
import LoadScene from './scene/load.js';
import TitleScene from './scene/title.js';
import UIScene from './scene/ui.js';
import UIWScene from './scene/uiW.js';
import UIVScene from './scene/uiV.js';
import SelectScene from './scene/gameSelect.js';
import InstructionScene from './scene/instruction.js';
import GameOverScene from './scene/gameover.js';
import WinScene from './scene/win.js';

class Game extends Phaser.Game {
	constructor() {
		super(config);

		// Add scenes (Key, Scene)
		this.scene.add('Game', GameScene);
		this.scene.add('WLevel', WaterScene);
		this.scene.add('VLevel', VillageScene);
		this.scene.add('Boot', BootScene);
		this.scene.add('Load', LoadScene);
		this.scene.add('Title', TitleScene);
		this.scene.add('Select', SelectScene);
		this.scene.add('Instruction', InstructionScene);
		this.scene.add('UI', UIScene);
		this.scene.add('UIW', UIWScene);
		this.scene.add('UIV', UIVScene);
		this.scene.add('GameOver', GameOverScene);
		this.scene.add('Win', WinScene);
		
		// Initial start
		this.scene.start('Boot');
	}
}

// On Window Load
window.onload = () => {
	// Creates instance of game class
	window.game = new Game();

	// Calls resize event once and then every time window is resized
	resizeGame();
	window.addEventListener('resize', resizeGame, false);
};

// Resizes to window
function resizeGame() {
	// Grabs canvas
	let canvas = document.querySelector('canvas');

	let windowWidth = window.innerWidth;
	let windowHeight = window.innerHeight;
	let ratioW = windowWidth / windowHeight;
	let ratioG = config.width / config.height;

	// Compares game window to browser window
	if (ratioW < ratioG) {
		canvas.style.width = windowWidth + 'px';
		canvas.style.height = (windowWidth / ratioG) + 'px';
	} else {
		canvas.style.width = (windowHeight * ratioG) + 'px';
		canvas.style.height = windowHeight+ 'px';
	}
}
