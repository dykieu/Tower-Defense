// Game Scenes (upload, create, update)
export default class GameScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Game');
	}

	init() {
		
	}
	
	create() {
		/*
		let logo = this.add.image(400, 300, 'logoImg');
		
		this.tweens.add({
			targets: logo,
			y: 450,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			loop: -1
		});*/

		// Create Map
		this.createMap();
	}

	createMap () {
		// Takes key from json map file
		this.bgMap = this.make.tilemap({key: 'map'});

		// Add title sets (Takes key of tile set)
		this.tiles = this.bgMap.addTilesetImage('terrain');

		// Create background layer (name of tile map, tile set, x pos, y pos)
		this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);
	}

	update() {
	
	}
}