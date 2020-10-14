import grid from '../config/grid.js';

import Alien from '../elements/alien.js';
import AlienB from '../elements/alienB.js';
import AlienR from '../elements/alienR.js';

import WoodTower from '../elements/tower.js';
import WoodProjectile from '../elements/projectile.js';

// Game Scenes (upload, create, update)
export default class GameScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Game');
	}

	init() {
		this.score = 0;
		this.hp = 1000;
		this.totalHp = 1000;
		this.gold = 8;
		this.towerSelected = 0;
		this.msgTimer = 0;

		// Wave variables
		this.waveTimer = 0;
		this.waveMsgOn = 0;
		this.waveActive = 0;
		this.wave = 0;

		this.waveGFinish = 0;
		this.waveBFinish = 0;
		this.waveRFinish = 0;

		this.numEnemiesG = 0;
		this.numEnemiesB = 0;
		this.numEnemiesR = 0;

		this.trackerG = 0;
		this.trackerB = 0;
		this.trackerR = 0;
		this.restTracker = 0;

		// Copying array into this.grid
		this.grid = grid.map((arr) => {
			return arr.slice();
		});

		// Setup error message for tower building
		this.buildErrorMsg(0, 0);
		this.msgTimer = 0;

		// Emit a game event (So UI scene can listen for it)
		this.events.emit('getUI');
		this.events.emit('decHp', this.hp, this.totalHp);
		this.events.emit('incScore', this.score);
		//this.events.emit('gold', this.gold);
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

		// Loads Wave msg
		this.loadWaveMsg();
	}

	update(time, change) {
		if (this.msgTimer > 0) {
			this.msgTimer -= 1;
		} else if (this.msgTimer <= 0) {
			this.errorMsg.alpha = 0;
			this.errorTxt.alpha = 0;
		}

		// Only let user place turret if a turret is selected
		if (this.towerSelected <= 0) {
			this.selector.alpha = 0;
		}

		// Checks if a wave is in progress
		if (this.waveActive === 1 && this.wave < 10) {
			if (time > this.trackerG) {
				if (this.numEnemiesG <= 20 * Math.pow(1.025, this.wave)) {
					// Checks for object that is not active & not visible (Returns obj if true else null)
					let spawnAlien = this.alienG.getFirstDead();
	
					// Creates first alien obj
					if (!spawnAlien) {
						spawnAlien = new Alien(this, 0, 0, this.path);
						this.alienG.add(spawnAlien);
						this.numEnemiesG += 1;
					}
	
					// Place Alien onto the path
					if (spawnAlien) {
						this.numEnemiesG += 1;
						spawnAlien.setActive(true);
						spawnAlien.setVisible(true);
						spawnAlien.spawn(Math.pow(2, this.wave), 1.05 * (this.wave));
						this.trackerG = time + 2000 / this.wave;
					}
				} else {
					this.waveGFinish = 1;
				}
			}

			// Only spawn blue monsters above level 4
			if (this.wave >= 4) {
				if (time > this.trackerB) {
					if (this.numEnemiesB <= 5 * Math.pow(1.15, this.wave - 3)) {
						// Checks for object that is not active & not visible (Returns obj if true else null)
						let spawnAlienB = this.alienB.getFirstDead();
		
						// Creates first alien obj
						if (!spawnAlienB) {
							spawnAlienB = new AlienB(this, 0, 0, this.path);
							this.alienB.add(spawnAlienB);
							this.numEnemiesB += 1;
						}
		
						// Place Alien onto the path
						if (spawnAlienB) {
							this.numEnemiesB += 1;
							spawnAlienB.setActive(true);
							spawnAlienB.setVisible(true);
							spawnAlienB.spawn(Math.pow(2, this.wave - 3), 1.025 * (this.wave - 3));
							this.trackerB = time + 3000 / (this.wave - 3);
						}
					} else {
						this.waveBFinish = 1;
					}
				}
			} else {
				this.waveBFinish = 1;
			}

			// Only spawn red monsters above level 7
			if (this.wave >= 7) {
				if (time > this.trackerR) {
					if (this.numEnemiesR <= 4 * Math.pow(1.10, this.wave - 6)) {
						// Checks for object that is not active & not visible (Returns obj if true else null)
						let spawnAlienR = this.alienR.getFirstDead();
						console.log('spawn r1');

						// Creates first alien obj
						if (!spawnAlienR) {
							console.log('spawn r2');
							spawnAlienR = new AlienR(this, 0, 0, this.path);
							this.alienR.add(spawnAlienR);
							this.numEnemiesR += 1;
						}
		
						// Place Alien onto the path
						if (spawnAlienR) {
							console.log('spawn r3');
							this.numEnemiesR += 1;
							spawnAlienR.setActive(true);
							spawnAlienR.setVisible(true);
							spawnAlienR.spawn(Math.pow(2, this.wave - 6), 1.10 * (this.wave - 6));
							this.trackerR = time + 4000 / (this.wave - 6);
						}
					} else {
						this.waveRFinish = 1;
					}
				}
			} else {
				this.waveRFinish = 1;
			}

			// If all 3 waves are finished, stop spawning
			if (this.waveGFinish === 1 && this.waveBFinish === 1 && this.waveRFinish === 1) {
				this.waveActive = 0;
				this.wave += 1; 

				this.waveGFinish = 0;
				this.waveBFinish = 0;
				this.waveRFinish = 0;

				this.restTracker = time + 10000;

				this.numEnemiesG = 0;
				this.numEnemiesB = 0;
				this.numEnemiesR = 0;

				this.events.emit('waveOFF'); 
			}
		} else if (this.wave >= 10) {
			// Boss stage
			console.log('Boss');
		} else {
			// If the first wave
			if (this.wave === 0) {
				this.wave += 9;
				this.restTracker = time + 5000;

				console.log('init');
			}
			
			// If pause period is over
			if (time > this.restTracker && this.wave < 10 && this.waveMsgOn == 0) {
				// Display wave message
				this.events.emit('displayWave', this.wave);
				this.splashBackground.alpha = 1;
				this.waveMsgImg.alpha = 1;
				this.waveMsgOn = 1;
				this.waveTimer = 150;

				console.log('Wave Msg');
			}

			// Wave Message Timer
			if (this.waveMsgOn === 1) {
				if (this.waveTimer > 0) {
					this.waveTimer -= 1;

				} else if (this.waveTimer <= 0) {
					this.events.emit('nextWave');
					this.events.emit('waveON');

					this.splashBackground.alpha = 0;
					this.waveMsgImg.alpha = 0;

					this.waveActive = 1;
					this.waveMsgOn = 0;

					console.log('Next Wave');
				}
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

	waveMsg (waveNum) {
		this.events.emit('displayWave', waveNum);
	}

	loadWaveMsg () {
		this.splashBackground = this.add.graphics();
		this.splashBackground.fillStyle(0x666666, 0.8);
		this.splashBackground.fillRect(0, 0, 1280, 960);
		this.splashBackground.alpha = 0;

		this.waveMsgImg = this.add.image(630, 220, 'forestWave');
		this.waveMsgImg.setScale(0.25);
		this.waveMsgImg.alpha = 0;

	}

	decHealth (dmg) {
		this.hp -= dmg;
		this.events.emit('decHp', this.hp, this.totalHp);

		// If hp loses then go to a gameover scene (DO THIS LATER)
		if (this.hp <= 0) {
			this.events.emit('gameOver');
			this.scene.start('Title');
		}
	}

	incScore (score) {
		this.score += score;
		this.events.emit('incScore', this.score);
	}

	addGold (amt) {
		this.gold += amt;
		this.events.emit('gold', this.gold);
	}

	/*******************************************************************
		Makes groups/a pool for element objects within the game
	*******************************************************************/
	makeObjPool () {
		// Runs update method for objects within this group
		this.alienG = this.physics.add.group({classType: Alien, runChildUpdate: true});
		this.alienB = this.physics.add.group({classType: AlienB, runChildUpdate: true});
		this.alienR = this.physics.add.group({classType: AlienR, runChildUpdate: true});

		this.towerW = this.add.group({classType: WoodTower, runChildUpdate: true});
		this.projectileW = this.physics.add.group({classType: WoodProjectile, runChildUpdate: true});
		
		// Check for colission (Wood projectile)
		this.physics.add.overlap(this.alienG, this.projectileW, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienB, this.projectileW, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienR, this.projectileW, this.takeDmg.bind(this));

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
		let castleImg = this.add.image(1120, 892, 'castle');
		castleImg.setScale(2);

		
		let scoreBox = this.add.graphics();
		scoreBox.fillStyle(0x666666, 0.8);
		scoreBox.fillRect(1140, 5, 135, 30);

		this.buildMenu();

		let healthBox = this.add.graphics();
		healthBox.fillStyle(0x666666, 1);
		healthBox.fillRect(390, 5, 500, 30);

		let healthBoxUI = this.add.graphics();
		healthBoxUI.fillStyle(0x666666, 0.8);
		healthBoxUI.fillRect(390, 45, 140, 25);

		let goldBoxUI = this.add.graphics();
		goldBoxUI.fillStyle(0x666666, 0.8);
		goldBoxUI.fillRect(390, 75, 140, 25);

		let curWave = this.add.graphics();
		curWave.fillStyle(0x666666, 0.8);
		curWave.fillRect(750, 75, 140, 25);

		let waveStatus = this.add.graphics();
		waveStatus.fillStyle(0x666666, 0.8);
		waveStatus.fillRect(750, 45, 140, 25);

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

		// Implement B aliens
		let allAlienB = this.alienB.getChildren();
		for (let i = 0; i < allAlienB.length; i++) {
			if (allAlienB[i].active && Phaser.Math.Distance.Between(posX,
				posY, allAlienB[i].x, allAlienB[i].y) <= dist) {
		
				return allAlienB[i];
			}
		}

		// Implement R aliens
		let allAlienR = this.alienR.getChildren();
		for (let i = 0; i < allAlienR.length; i++) {
			if (allAlienR[i].active && Phaser.Math.Distance.Between(posX,
				posY, allAlienR[i].x, allAlienR[i].y) <= dist) {
		
				return allAlienR[i];
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
			alienObj.damage(6);
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
			if (this.towerSelected === 1 && this.gold - 4 >= 0) {
				let towerW = this.towerW.getFirstDead();

				// Creates towerW if none are available
				if (!towerW) {
					towerW = new WoodTower(this, 0, 0, this.grid);
					this.towerW.add(towerW);
				}
	
				towerW.setActive(true);
				towerW.setVisible(true);
				this.gold -= 4;
				this.events.emit('gold', this.gold);
				towerW.placeTower(mouseX, mouseY);
			} else if (this.towerSelected === 1 && this.gold <= 4) {
				this.buildErrorMsg(ptr.x, ptr.y);
			}
		}
	}

	buildErrorMsg (x, y) {
		this.errorMsg = this.add.graphics();
		this.errorMsg.fillStyle(0x666666, 0.8);
		this.errorMsg.fillRect(x + 10, y + 10, 160, 25);
		this.errorMsg.alpha = 1;

		this.errorTxt = this.make.text({
			x: x + 15,
			y: y + 15,
			text: 'Not Enough GOLD!',
			style: {
				font: '18px Monserrat',
				fill: '#ffffff'
			}
		});
		this.errorTxt.alpha = 1;

		this.msgTimer = 20;
	}

	buildMenu() {
		let menuBox = this.add.graphics();
		menuBox.fillStyle(0x666666, 0.8);
		menuBox.fillRect(1140, 50, 138, 30);

		// Open tower Menu
		this.selectTowerBtn = this.add.sprite(1210, 67.5, 'gameBtn').setInteractive();
		this.selectTowerBtn.setScale(0.1);
		this.buildText = this.add.text(0, 0, 'Build', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		Phaser.Display.Align.In.Center(
			this.buildText,
			this.selectTowerBtn
		);

		// Tower Menu Box
		this.menuBox = this.add.graphics();
		this.menuBox.fillStyle(0x666666, 0.8);
		this.menuBox.fillRect(1140, 100, 138, 150);
		this.menuBox.alpha = 0;

		// Close tower menu
		this.closeMenuBtn = this.add.sprite(1210, 280, 'gameBtn').setInteractive();
		this.closeMenuBtn.setScale(0.1);
		this.closeMenuText = this.add.text(0, 0, 'Close', {
			fontSize: '18px',
			fill: '#fff'
		});
		this.closeMenuText.alpha = 0;

		Phaser.Display.Align.In.Center(
			this.closeMenuText,
			this.closeMenuBtn
		);
		this.closeMenuBtn.alpha = 0;

		this.towerBtn1 = this.add.sprite(1210, 130, 'woodTower').setInteractive();
		this.towerBtn1.setScale(0.75);
		this.towerBtn1.alpha = 0;

		// Tower Tool Tips
		this.towerBtn1ToolTipBox = this.add.graphics();
		this.towerBtn1ToolTipBox.fillStyle(0x666666, 1);
		this.towerBtn1ToolTipBox.fillRect(1050, 115, 140, 30);

		this.towerBtn1ToolTipText = this.add.text(1055, 122.5, 'Cost: 2 Gold', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		this.towerBtn1ToolTipBox.alpha = 0;
		this.towerBtn1ToolTipText.alpha = 0;

		// Menu Interactions
		this.closeMenuBtn.on('pointerdown', function (pointer) {
			this.menuBox.alpha = 0;
			this.towerBtn1.alpha = 0;
			this.closeMenuBtn.alpha = 0;
			this.closeMenuText.alpha = 0;
			this.selector.alpha = 0;
			this.towerSelected = 0;
			this.towerBtn1.setTexture('woodTower');
		}.bind(this));
	
		this.selectTowerBtn.on('pointerdown', function (pointer) {
			this.menuBox.alpha = 1;
			this.towerBtn1.alpha = 1;
			this.closeMenuBtn.alpha = 1;
			this.closeMenuText.alpha = 1;
		}.bind(this));

		this.towerBtn1.on('pointerdown', function (pointer) {
			this.towerBtn1.setTexture('woodTowerHover');
			this.towerSelected = 1;
		}.bind(this));

		this.selectTowerBtn.on('pointerover', function (pointer) {
			this.selectTowerBtn.setTexture('gameBtnHover');
		}.bind(this));
	
		this.selectTowerBtn.on('pointerout', function (pointer) {
			this.selectTowerBtn.setTexture('gameBtn');
		}.bind(this));

		this.closeMenuBtn.on('pointerover', function (pointer) {
			this.closeMenuBtn.setTexture('gameBtnHover');
		}.bind(this));
	
		this.closeMenuBtn.on('pointerout', function (pointer) {
			this.closeMenuBtn.setTexture('gameBtn');
		}.bind(this));

		this.towerBtn1.on('pointerover', function (pointer) {
			this.towerBtn1.setTexture('woodTowerHover');
			this.towerBtn1ToolTipBox.alpha = 1;
			this.towerBtn1ToolTipText.alpha = 1;
		}.bind(this));
	
		this.towerBtn1.on('pointerout', function (pointer) {
			this.towerBtn1ToolTipBox.alpha = 0;
			this.towerBtn1ToolTipText.alpha = 0;
			if (this.towerSelected != 1) {
				this.towerBtn1.setTexture('woodTower');
			}
		}.bind(this));

	}
}