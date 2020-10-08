// Game Scenes (upload, create, update)
export default class GameScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Game');
	}

	preload() {
		this.load.image('logoImg', './test.png');
	}
	
	create() {
		let logo = this.add.image(400, 300, 'logoImg');
		this.tweens.add({
			targets: logo,
			y: 450,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			loop: -1
		});
	}

	update() {
	
	}
}