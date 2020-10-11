// Game Scenes (upload, create, update)
export default class GameScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Game');
	}

	init() {
		
	}
	
	create() {
		// Create Map
		this.createMap();

		// Create Path
		this.createPath();
	}

	createMap () {
		// Takes key from json map file
		this.bgMap = this.make.tilemap({key: 'map'});

		// Add title sets (Takes key of tile set)
		this.tiles = this.bgMap.addTilesetImage('terrain');

		// Create background layer (name of tile map, tile set, x pos, y pos)
		this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);

		// Create Castle (At end)
		let castleImg = this.add.image(1120, 890, 'castle');
		castleImg.setScale(0.25);
	}	

	createPath () {
		// Creating a path
		this.graphics = this.add.graphics();
		
		// x , y of first point
		// x , y of second point
		this.path = this.add.path(160, -31);
		this.path.lineTo(160, 285);
		this.path.lineTo(480, 285);
		this.path.lineTo(480, 670);
		this.path.lineTo(1120, 670);
		this.path.lineTo(1120, 920);

		// For path testing purposes (line thickness, line color, opacity)
		this.graphics.lineStyle(3, 0xffffff, 1);
		this.path.draw(this.graphics);
	}

	update() {
	
	}
}