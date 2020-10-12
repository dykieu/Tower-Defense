import grid from '../config/grid.js';
import Alien from '../elements/alien.js';

// Game Scenes (upload, create, update)
export default class GameScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Game');
	}

	init() {
		this.wave = 1;
		this.numEnemies = 0;
		this.tracker = 0;

		// Copying array into this.grid
		this.grid = grid.map((arr) => {
			return arr.slice();
		});
		//console.log(this.grid);

	}
	
	create() {
		// Create Map
		this.createMap();

		// Create Path
		this.createPath();

		// Create tile/grid selector
		this.createSelector();

		// Make game objects
		this.makeObjPool();
	}

	update(time, change) {
		// Create an enemy object in intevals
		if (time > this.tracker && this.wave <= 10) {
			/*
				Here we are spawning from alienG but we can time it by wave # to change enemy type
				We can also rewrite the alien class to produce specific stats on the alien
				Have not tested it yet
			*/
			if (this.numEnemies <= this.wave * 10) {
				// Checks for object that is not active & not visible (Returns obj if true else null)
				let spawnAlien = this.alienG.getFirstDead();

				// Creates first alien obj
				if (!spawnAlien) {
					spawnAlien = new Alien(this, 0, 0, this.path);
					this.alienG.add(spawnAlien);
					this.numEnemies += 1;
				}

				// Place Alien onto the path
				if (spawnAlien) {
					this.numEnemies += 1;
					spawnAlien.setActive(true);
					spawnAlien.setVisible(true);
					spawnAlien.spawn(50 * this.wave, 1.5 * this.wave);
					this.tracker = time + 5000 / this.wave;
				}
			} else {
				this.wave += 1;
				console.log(this.wave);
			}
		}
	}

	createSelector() {
		// Add a selector icon and scales it
		// (Alpha 1 = visible, alpha 0 = not visible)
		this.selector = this.add.image(32, 32, 'selector');
		//this.selector.setScale(0.25);
		this.selector.alpha = 0;

		// Listen to mouse movement
		this.input.on('pointermove', function (pointer) {
			// Grabs mouse position & divide by 64 (To get index of array)
			let mouseY = Math.floor(pointer.y / 64);
			let mouseX = Math.floor(pointer.x / 64);

			// Check if position available
			if (this.checkPosition(mouseY, mouseX)) {
				// If true, update cursor position (32 to center)
				this.selector.setPosition(mouseX * 64 + 32, mouseY * 64 + 32);
				this.selector.alpha = 0.9;
			} else {
				// If false
				this.selector.alpha = 0;
			}
		}.bind(this));
	}

	makeObjPool () {
		// Runs update method for objects within this group
		this.alienG = this.physics.add.group({classType: Alien, runChildUpdate: true});
	}

	createMap () {
		// Takes key from json map file
		this.bgMap = this.make.tilemap({key: 'map'});

		// Add title sets (Takes key of tile set)
		this.tiles = this.bgMap.addTilesetImage('terrain');

		// Create background layer (name of tile map, tile set, x pos, y pos)
		this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);
		this.backgroundLayer = this.bgMap.createStaticLayer('Foreground', this.tiles, 0, 0);

		// Create Castle (At end) (And adjust scale)
		let castleImg = this.add.image(1120, 855, 'castle');
		castleImg.setScale(2);
	}	

	checkPosition (y, x) {
		// Checks position of coordinates
		return this.grid[y][x] === 0;
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
		//this.graphics.lineStyle(3, 0xffffff, 1);
		//this.path.draw(this.graphics);
	}
}