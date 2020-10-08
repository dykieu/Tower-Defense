/*
	Booting Up the game
*/
export default class BootScene extends Phaser.Scene {
	constructor() {
		super('Boot');
	}

	preload() {
		this.load.image('logo', './test.png');		
	}
	
	create() {
		// starts the next scene
		this.scene.start('Load');
	}

}