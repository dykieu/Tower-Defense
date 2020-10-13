import grid from '../config/grid.js';
import Alien from '../elements/alien.js';
import WoodTower from '../elements/tower.js';
import WoodProjectile from '../elements/projectile.js';

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

	/*******************************************************************
		Creates a selection graphic to show users valid areas on the
		current grid. Will change Listen to mouse event and set the
		selector visibility accordingly
	*******************************************************************/
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

	/*******************************************************************
		Makes groups/a pool for element objects within the game
	*******************************************************************/
	makeObjPool () {
		// Runs update method for objects within this group
		this.alienG = this.physics.add.group({classType: Alien, runChildUpdate: true});
		this.towerW = this.add.group({classType: WoodTower, runChildUpdate: true});
		this.projectileW = this.physics.add.group({classType: WoodProjectile, runChildUpdate: true});
		
		// Check for colission
		this.physics.add.overlap(this.alienG, this.projectileW, this.takeDmg.bind(this));


		// Listen for player click and runs buildTower
		this.input.on('pointerdown', this.buildTower.bind(this));
	}

	/*******************************************************************
		Grabs the .json map file, the corresponding tileset and then
		renders the map based on the layers saved within the file.
	*******************************************************************/
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

	/*******************************************************************
		Receives a Y and X value representing mouse coordinates. Checks
		the specified position with the grid and returns T or F based
		on validity of the current position.
	*******************************************************************/
	checkPosition (y, x) {
		// Checks position of coordinates
		return this.grid[y][x] === 0;
	}

	/*******************************************************************
		Creates an invisible line for units to follow. Takes two points
		and joins them into a line path. 
	*******************************************************************/
	createPath () {
		// Creating a path
		this.graphics = this.add.graphics();
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

	/*******************************************************************
		Receives x position, y position and distance of an alien unit.
		Function checks that the enemy is active (alive) and that it is
		still within distance of the turret. If it is, function will
		return which unit it is. 
	*******************************************************************/
	findAlien (posX, posY, dist) {
		// Grabs all G aliens
		let allAlienG = this.alienG.getChildren();
		for (let i = 0; i < allAlienG.length; i++) {
			if (allAlienG[i].active && Phaser.Math.Distance.Between(posX,
				posY, allAlienG[i].x, allAlienG[i].y) <= dist) {
		
				return allAlienG[i];
			}
		}
		return false;
	}


	fireProjectile (posX, posY, angle) {
		let projectileW = this.projectileW.getFirstDead();

		if (!projectileW) {
			projectileW = new WoodProjectile(this, 0, 0);
			this.projectileW.add(projectileW);
		}

		projectileW.attack(posX, posY, angle);
	}

	takeDmg (alienObj, projectileObj) {
		// Verify valid objects
		if (alienObj.active === true && projectileObj.active === true) {
			// Remove projectile
			projectileObj.setActive(false);
			projectileObj.setVisible(false);

			// Account for damage to enemy
			alienObj.damage(50);
		}
	}

	/*******************************************************************
		Function receives mouse location (ptr) and converts it into
		X and Y coordinates. Function then checks that the position 
		is valid and will place a turret at the mouse pointer.
	*******************************************************************/
	buildTower (ptr) {
		let mouseY = Math.floor(ptr.y / 64);
		let mouseX = Math.floor(ptr.x / 64);

		// Validate grid spot
		if (this.checkPosition(mouseY, mouseX)) {
			let towerW = this.towerW.getFirstDead();

			// Creates towerW if none are available
			if (!towerW) {
				towerW = new WoodTower(this, 0, 0, this.grid);
				this.towerW.add(towerW);
			}

			towerW.setActive(true);
			towerW.setVisible(true);
			towerW.placeTower(mouseX, mouseY);
		}
	}
}