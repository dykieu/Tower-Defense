import grid from '../water/config/grid.js';

import Alien from '../water/elements/alien.js';
import AlienB from '../water/elements/alienB.js';
import AlienR from '../water/elements/alienR.js';
import Boss from '../water/elements/alienBoss.js';

import WoodTower from '../water/elements/tower.js';
import FlameTower from '../water/elements/towerF.js';
import SCTower from '../water/elements/towerSC.js';

import WoodProjectile from '../water/elements/projectile.js';
import scProjectile from '../water/elements/projectileSC.js';
import fProjectile from '../water/elements/projectileF.js';

// Game Scenes (upload, create, update)
export default class WaterScene extends Phaser.Scene {
	// Allows your to pass propeties to constructor of parent class
	constructor() {
		super('Island');
	}

	init() {
		this.score = 0;
		this.hp = 1000;
		this.totalHp = 1000;
		this.gold = 8;
		this.towerSelected = 0;
		this.msgTimer = 0;
		this.gameClear = 0;
		this.bossActive = 0;
		this.bossMsgTimer = 1000;
		this.bossMsgFlash = 0;
		this.flashTimer = 30;
		this.wave9over = 0;

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
		this.bossTimer = 5000;
		this.restTracker = 0;

		// Copying array into this.grid
		this.grid = grid.map((arr) => {
			return arr.slice();
		});

		// Copying possible positions to place tower
		let towerPositions = [];
		let i = 0;
		for(i = 0; i < this.grid.length; i++){
			let j = 0;
			for(j = 0; j < this.grid[i].length; j++) {
				if (this.grid[i][j] === 0) {
					let coord = {
						y: i,
						x: j
					};
					towerPositions.push(coord);
				}
			}
		}

		this.towerPositions = towerPositions;

		// Setup error message for tower building
		this.buildErrorMsg(0, 0);
		this.msgTimer = 0;

		// Emit a game event (So UI scene can listen for it)
		this.events.emit('getUIW');
		this.events.emit('decHpW', this.hp, this.totalHp);
		this.events.emit('incScoreW', this.score);
		this.events.emit('goldW', this.gold);
		this.events.emit('waveInitW', this.wave);
		this.events.emit('waveOFFW'); 
	}
	
	create() {
        this.loadSound();
        this.bgm.play();

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
		// Timer for tooltip message (Tower)
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

				this.events.emit('waveOFFW'); 
			}
		} else if (this.wave >= 10 && this.wave9over === 0) {
			// Boss stage
			console.log('set boss stage timer');
			this.wave9over = 1;
			this.bossTimer = time + 20000;
			this.bossMsgTimer = 1000;
		} else {
			// If the first wave + timer in between wave
			if (this.wave === 0) {
				this.wave += 1;
				this.restTracker = time + 10000;
			}
			
			// If pause period is over
			if (time > this.restTracker && this.wave < 10 && this.waveMsgOn == 0) {
				// Display wave message
				this.events.emit('displayWaveW', this.wave);
				this.splashBackground.alpha = 1;
				this.waveMsgImg.alpha = 1;
				this.waveMsgOn = 1;
				this.waveTimer = 150;
			}

			// Wave Message Timer
			if (this.waveMsgOn === 1) {
				if (this.waveTimer > 0) {
					this.waveTimer -= 1;

				// If timer over, Indicate next wave
				} else if (this.waveTimer <= 0) {
					this.events.emit('nextWaveW');
					this.events.emit('waveONW');

					this.splashBackground.alpha = 0;
					this.waveMsgImg.alpha = 0;

					this.waveActive = 1;
					this.waveMsgOn = 0;
				}
			}
		}

		// If Wave 9 is over and boss timer isnt 0 yet, decrement the timer
		if (this.wave9over === 1 && this.bossMsgTimer > 0) {
			this.bossMsgTimer -= 1;
		}

		// If there is 200 left on timer, display boss message for user
		if (this.bossMsgTimer < 200 && this.bossMsgTimer > 0) {
			this.bossMsgImg.alpha = 1;
		}

		// If boss spawn, disable boss msg
		if (time > this.bossTimer && this.bossActive === 1) {
			this.bossMsgImg.alpha = 0;
			this.bossMsgFlash = 1;
		}

		// If it is after wave 9, boss isnt active and timer has passed paused period, spawn boss
		if (time > this.bossTimer && this.bossActive === 0 && this.wave9over === 1) {
			this.events.emit('nextWaveW');
			this.events.emit('waveONW');

			// Checks for object that is not active & not visible (Returns obj if true else null)
			let spawnBoss = this.boss.getFirstDead();

			// Creates first alien obj
			if (!spawnBoss) {
				spawnBoss = new Boss(this, 0, 0, this.path);
				this.boss.add(spawnBoss);
			}

			// Place Alien onto the path
			if (spawnBoss) {
				spawnBoss.setActive(true);
				spawnBoss.setVisible(true);
				spawnBoss.spawn(4, 1.0);
			}

			// Indicate boss is on the map
			this.bossActive = 1;
		}
    }
    
    loadSound () {
        this.click = this.sound.add('click', {
            loop: false,
            volume: 1,
            delay: 0
        });

        this.bgm = this.sound.add('wBGM', {
            loop: true,
            volume: 0.15,
            delay: 0
        });
        
        this.att1 = this.sound.add('att1', {
            loop: false,
            volume: 0.1,
            delay: 100
        });

        this.att2 = this.sound.add('att2', {
            loop: false,
            volume: 0.1,
            delay: 100
        });

        this.att3 = this.sound.add('att3', {
            loop: false,
            volume: 0.1,
            delay: 100
        });
    }

	/*******************************************************************
		Creates a selection graphic to show users valid areas on the
		current grid. Will change Listen to mouse event and set the
		selector visibility accordingly
	*******************************************************************/
	createSelector() {
		// Add a selector icon and scales it
		this.selector = this.add.image(32, 32, 'selector');
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

	// Displays wave message (What level it is)
	waveMsg (waveNum) {
		this.events.emit('displayWaveW', waveNum);
	}

	// Loads assets for wave msg
	loadWaveMsg () {
		this.splashBackground = this.add.graphics();
		this.splashBackground.fillStyle(0x666666, 0.5);
		this.splashBackground.fillRect(0, 0, 1280, 960);
		this.splashBackground.alpha = 0;

		this.bossMsgImg = this.add.image(300,180, 'bossWave');
		this.bossMsgImg.setScale(0.55);
		this.bossMsgImg.alpha = 0;

		this.waveMsgImg = this.add.image(300, 180, 'forestWave');
		this.waveMsgImg.setScale(0.55);
		this.waveMsgImg.alpha = 0;
	}

	// Decreases hp of castle
	decHealth (dmg) {
		
		this.hp -= dmg;
		this.events.emit('decHpW', this.hp, this.totalHp);

		// If hp loses then go to a gameover scene
		if (this.hp <= 0) {
            this.bgm.stop();
            this.bgm.destroy();
			this.events.emit('gameOverW');
			this.scene.start('GameOver');
		}
	}

	// Increase score counter
	incScore (score) {
		this.score += score;
		this.events.emit('incScoreW', this.score);
	}

	// Increase gold counter
	addGold (amt) {
		this.gold += amt;
		this.events.emit('goldW', this.gold);
	}

	/*******************************************************************
		Makes groups/a pool for element objects within the game
	*******************************************************************/
	makeObjPool () {
		// Runs update method for objects within this group
		this.alienG = this.physics.add.group({classType: Alien, runChildUpdate: true});
		this.alienB = this.physics.add.group({classType: AlienB, runChildUpdate: true});
		this.alienR = this.physics.add.group({classType: AlienR, runChildUpdate: true});
		this.boss = this.physics.add.group({classType: Boss, runChildUpdate: true});

		// Tower group
		this.towerW = this.add.group({classType: WoodTower, runChildUpdate: true});
		this.towerSC = this.add.group({classType: SCTower, runChildUpdate: true});
		this.towerF = this.add.group({classType: FlameTower, runChildUpdate: true});

		// Projectile group
		this.projectileW = this.physics.add.group({classType: WoodProjectile, runChildUpdate: true});
		this.projectileSC = this.physics.add.group({classType: scProjectile, runChildUpdate: true});
		this.projectileF = this.physics.add.group({classType: fProjectile, runChildUpdate: true});
		
		// Check for colission (Wood projectile)
		this.physics.add.overlap(this.alienG, this.projectileW, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienB, this.projectileW, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienR, this.projectileW, this.takeDmg.bind(this));
		this.physics.add.overlap(this.boss, this.projectileW, this.takeDmg.bind(this));

		// Check for colission (SC projectile)
		this.physics.add.overlap(this.alienG, this.projectileSC, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienB, this.projectileSC, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienR, this.projectileSC, this.takeDmg.bind(this));
		this.physics.add.overlap(this.boss, this.projectileSC, this.takeDmg.bind(this));
		
		// Check for colission (Flame projectile)
		this.physics.add.overlap(this.alienG, this.projectileF, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienB, this.projectileF, this.takeDmg.bind(this));
		this.physics.add.overlap(this.alienR, this.projectileF, this.takeDmg.bind(this));
		this.physics.add.overlap(this.boss, this.projectileF, this.takeDmg.bind(this));

		// Listen for player click and runs buildTower
		this.input.on('pointerdown', this.buildTower.bind(this));
	}

	/*******************************************************************
		Grabs the .json map file, the corresponding tileset and then
		renders the map based on the layers saved within the file.
	*******************************************************************/
	/*
		FIX
	*/
	createMap () {
		// Takes key from json map file
		this.bgMap = this.make.tilemap({key: 'wmap'});

		// Add title sets (Takes key of tile set)
		this.tiles = this.bgMap.addTilesetImage('wterrain');

		// Create background layer (name of tile map, tile set, x pos, y pos)
		this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);
		//this.backgroundLayer = this.bgMap.createStaticLayer('Foreground', this.tiles, 0, 0);

		// Create Castle (At end) (And adjust scale)
		let castleImg = this.add.image(62, 550, 'wcastle');

		// Background for score
		let scoreBox = this.add.graphics();
		scoreBox.fillStyle(0x666666, 0.8);
		scoreBox.fillRect(1140, 5, 135, 30);

		// build menu
		this.buildMenu();

		// Background for castle health bar
		let healthBox = this.add.graphics();
		healthBox.fillStyle(0x666666, 1);
		healthBox.fillRect(390, 5, 500, 30);

		// Background for health value
		let healthBoxUI = this.add.graphics();
		healthBoxUI.fillStyle(0x666666, 0.8);
		healthBoxUI.fillRect(390, 45, 140, 25);

		// Background for gold value
		let goldBoxUI = this.add.graphics();
		goldBoxUI.fillStyle(0x666666, 0.8);
		goldBoxUI.fillRect(390, 75, 140, 25);

		// Background for current wave indicator
		let curWave = this.add.graphics();
		curWave.fillStyle(0x666666, 0.8);
		curWave.fillRect(750, 75, 140, 25);

		// Background for wave status
		let waveStatus = this.add.graphics();
		waveStatus.fillStyle(0x666666, 0.8);
		waveStatus.fillRect(750, 45, 140, 25);

		// Background for boss hp bar
		this.bossHp = this.add.graphics();
		this.bossHp.fillStyle(0x666666, 0.5);
		this.bossHp.fillRect(0, 0, 100, 10);
		this.bossHp.alpha = 0;
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
		this.path = this.add.path(1300, 360);
		this.path.lineTo(820, 360);
		this.path.lineTo(820, 500);
		this.path.lineTo(350, 500);
		this.path.lineTo(350, 600);
		this.path.lineTo(124, 600);
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

		// Implement Boss aliens
		let allBoss = this.boss.getChildren();
		for (let i = 0; i < allBoss.length; i++) {
			if (allBoss[i].active && Phaser.Math.Distance.Between(posX,
				posY, allBoss[i].x, allBoss[i].y) <= dist) {
		
				return allBoss[i];
			}
		}

		return false;
	}

	/**************************************************************************
		Receives position of enemy, angle and what type of projectile to fire
	***************************************************************************/
	fireProjectile (posX, posY, angle, type) {
		// Fires wood arrow (T1 turret)
		if (type === 1) {
			// If object exists, reuse it
			let projectileW = this.projectileW.getFirstDead();

			// If no objects, create it
			if (!projectileW) {
				projectileW = new WoodProjectile(this, 0, 0);
				this.projectileW.add(projectileW);
			}
	
			// Shoot projectile
			projectileW.attack(posX, posY, angle);
            this.att1.play();
		// Fires SC arrow (T2 turret)
		} else if (type === 2) {
			let projectileSC = this.projectileSC.getFirstDead();

			if (!projectileSC) {
				projectileSC = new scProjectile(this, 0, 0);
				this.projectileSC.add(projectileSC);
			}
	
			projectileSC.attack(posX, posY, angle);
            this.att2.play();
		// Fires fire arrow (T3 turret)
		}else if (type === 3) {
			let projectileF = this.projectileF.getFirstDead();

			if (!projectileF) {
				projectileF = new fProjectile(this, 0, 0);
				this.projectileF.add(projectileF);
			}
	
            projectileF.attack(posX, posY, angle);
            this.att3.play();
		}
	}

	/********************************************************************
		Calculates the damage that an arrow does and applies it
		We should update this to do different dmg per projectile
	*********************************************************************/
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
		// Current mouse position
		let mouseY = Math.floor(ptr.y / 64);
		let mouseX = Math.floor(ptr.x / 64);

		// Validate grid spot
		if (this.checkPosition(mouseY, mouseX)) {
			this.selector.alpha = 0;
			// T1 tower
			if (this.towerSelected === 1 && this.gold - 4 >= 0) {
				//If tower exists, reuse
				this.grid[mouseY][mouseX] = 5;
				let towerW = this.towerW.getFirstDead();

				// Creates towerW if none are available
				if (!towerW) {
					towerW = new WoodTower(this, 0, 0, this.grid);
					this.towerW.add(towerW);
				}
				
				// Display tower
				towerW.setActive(true);
				towerW.setVisible(true);

				// Decrement gold
				this.gold -= 4;
				this.events.emit('goldW', this.gold);

				// Place turret
				towerW.placeTower(mouseX, mouseY);
			
			// Error tool tip if not enough gold
			} else if (this.towerSelected === 1 && this.gold <= 4) {
				this.buildErrorMsg(ptr.x, ptr.y);
			}

			// T2 Tower
			if (this.towerSelected === 2 && this.gold - 6 >= 0) {
				this.grid[mouseY][mouseX] = 5;
				let towerSC = this.towerSC.getFirstDead();

				if (!towerSC) {
					towerSC = new SCTower(this, 0, 0, this.grid);
					this.towerSC.add(towerSC);
				}
	
				towerSC.setActive(true);
				towerSC.setVisible(true);
				this.gold -= 6;
				this.events.emit('goldW', this.gold);
				towerSC.placeTower(mouseX, mouseY);
			} else if (this.towerSelected === 2 && this.gold <= 6) {
				this.buildErrorMsg(ptr.x, ptr.y);
			}

			// T3 tower
			if (this.towerSelected === 3 && this.gold - 8 >= 0) {
				this.grid[mouseY][mouseX] = 5;
				let towerF = this.towerF.getFirstDead();

				if (!towerF) {
					towerF = new FlameTower(this, 0, 0, this.grid);
					this.towerF.add(towerF);
				}
	
				towerF.setActive(true);
				towerF.setVisible(true);
				this.gold -= 8;
				this.events.emit('goldW', this.gold);
				towerF.placeTower(mouseX, mouseY);
			} else if (this.towerSelected === 3 && this.gold <= 8) {
				this.buildErrorMsg(ptr.x, ptr.y);
			}
		}
		// After building a tower, Check the possible positions for errors and reset grind
		// Encountered bug where positions changed to 1 when they shouldnt be
		let i = 0;
		for (i = 0; i < this.towerPositions.length; i++) {
			if (this.grid[this.towerPositions[i].y][this.towerPositions[i].x] === 1) {
				// Reset That position
				this.grid[this.towerPositions[i].y][this.towerPositions[i].x] = 0;
			}
		}
	}

	// Error Message to inform users that they cant build a tower (Receives mouse position)
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

	// Tower building menu
	buildMenu() {
		// Exit tower Menu
		this.exitBtn = this.add.sprite(1070, 20, 'gameBtn').setInteractive();
		this.exitBtn.setScale(0.1);
		this.exitText = this.add.text(0, 0, 'Exit', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		Phaser.Display.Align.In.Center(
			this.exitText,
			this.exitBtn
		);

		// Menu box background
		let menuBox = this.add.graphics();
		menuBox.fillStyle(0x666666, 0.8);
		menuBox.fillRect(1140, 668, 138, 30);

		// Open tower Menu
		this.selectTowerBtn = this.add.sprite(1210, 685.5, 'gameBtn').setInteractive();
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
		this.menuBox.fillRect(1140, 718, 138, 200);
		this.menuBox.alpha = 0;

		// Close tower menu
		this.closeMenuBtn = this.add.sprite(1210, 940, 'gameBtn').setInteractive();
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

		// Tower selection buttons
		this.towerBtn1 = this.add.sprite(1210, 748, 'wTower1').setInteractive();
		this.towerBtn1.setScale(0.75);
		this.towerBtn1.alpha = 0;

		this.towerBtn2 = this.add.sprite(1210, 812, 'wTower2').setInteractive();
		this.towerBtn2.setScale(0.75);
		this.towerBtn2.alpha = 0;

		this.towerBtn3 = this.add.sprite(1210, 876, 'wTower3').setInteractive();
		this.towerBtn3.setScale(0.75);
		this.towerBtn3.alpha = 0;

		// Tower Tool Tips
		this.towerBtn1ToolTipBox = this.add.graphics();
		this.towerBtn1ToolTipBox.fillStyle(0x666666, 1);
		this.towerBtn1ToolTipBox.fillRect(1040, 733, 140, 30);

		this.towerBtn1ToolTipText = this.add.text(1045, 740, 'Cost: 4 Gold', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		this.towerBtn1ToolTipBox.alpha = 0;
		this.towerBtn1ToolTipText.alpha = 0;

		this.towerBtn2ToolTipBox = this.add.graphics();
		this.towerBtn2ToolTipBox.fillStyle(0x666666, 1);
		this.towerBtn2ToolTipBox.fillRect(1040, 797, 140, 30);

		this.towerBtn2ToolTipText = this.add.text(1045, 804, 'Cost: 6 Gold', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		this.towerBtn2ToolTipBox.alpha = 0;
		this.towerBtn2ToolTipText.alpha = 0;

		this.towerBtn3ToolTipBox = this.add.graphics();
		this.towerBtn3ToolTipBox.fillStyle(0x666666, 1);
		this.towerBtn3ToolTipBox.fillRect(1040, 861, 140, 30);

		this.towerBtn3ToolTipText = this.add.text(1045, 867, 'Cost: 8 Gold', {
			fontSize: '18px',
			fill: '#fff'
		});
		
		this.towerBtn3ToolTipBox.alpha = 0;
		this.towerBtn3ToolTipText.alpha = 0;

		// Game exit button
		this.exitBtn.on('pointerdown', function () {
            this.bgm.stop();
            this.bgm.destroy();
            this.click.play();
			this.events.emit('gameOverW');
			this.scene.start('Title', {restartBgm: 1});
		}.bind(this));

		// Menu Interactions
		this.closeMenuBtn.on('pointerdown', function (pointer) {
			this.menuBox.alpha = 0;
			this.towerBtn1.alpha = 0;
			this.towerBtn2.alpha = 0;
			this.towerBtn3.alpha = 0;
			this.closeMenuBtn.alpha = 0;
			this.closeMenuText.alpha = 0;
			this.selector.alpha = 0;
			this.towerSelected = 0;

            this.click.play();

			this.towerBtn1.setTexture('wTower1');
			this.towerBtn2.setTexture('wTower2');
			this.towerBtn3.setTexture('wTower3');
		}.bind(this));
	
		this.selectTowerBtn.on('pointerdown', function (pointer) {
			this.menuBox.alpha = 1;
			this.towerBtn1.alpha = 1;
			this.towerBtn2.alpha = 1;
			this.towerBtn3.alpha = 1;
			this.closeMenuBtn.alpha = 1;
            this.closeMenuText.alpha = 1;
            this.click.play();
		}.bind(this));

		this.towerBtn1.on('pointerdown', function (pointer) {
			this.towerBtn1.setTexture('wTower1Hover');
			this.towerBtn2.setTexture('wTower2');
			this.towerBtn3.setTexture('wTower3');

			this.towerSelected = 1;
		}.bind(this));

		this.towerBtn2.on('pointerdown', function (pointer) {
			this.towerBtn1.setTexture('wTower1');
			this.towerBtn2.setTexture('wTower2Hover');
			this.towerBtn3.setTexture('wTower3');

			this.towerSelected = 2;
		}.bind(this));

		this.towerBtn3.on('pointerdown', function (pointer) {
			this.towerBtn1.setTexture('wTower1');
			this.towerBtn2.setTexture('wTower2');
			this.towerBtn3.setTexture('wTower3Hover');
			this.towerSelected = 3;
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
			this.towerBtn1.setTexture('wTower1Hover');
			this.towerBtn1ToolTipBox.alpha = 1;
			this.towerBtn1ToolTipText.alpha = 1;
		}.bind(this));

		this.towerBtn2.on('pointerover', function (pointer) {
			this.towerBtn2.setTexture('wTower2Hover');
			this.towerBtn2ToolTipBox.alpha = 1;
			this.towerBtn2ToolTipText.alpha = 1;
		}.bind(this));

		this.towerBtn3.on('pointerover', function (pointer) {
			this.towerBtn3.setTexture('wTower3Hover');
			this.towerBtn3ToolTipBox.alpha = 1;
			this.towerBtn3ToolTipText.alpha = 1;
		}.bind(this));
	
		this.towerBtn1.on('pointerout', function (pointer) {
			this.towerBtn1ToolTipBox.alpha = 0;
			this.towerBtn1ToolTipText.alpha = 0;
			if (this.towerSelected != 1) {
				this.towerBtn1.setTexture('wTower1');
			}
		}.bind(this));

		this.towerBtn2.on('pointerout', function (pointer) {
			this.towerBtn2ToolTipBox.alpha = 0;
			this.towerBtn2ToolTipText.alpha = 0;
			if (this.towerSelected != 2) {
				this.towerBtn2.setTexture('wTower2');
			}
		}.bind(this));

		this.towerBtn3.on('pointerout', function (pointer) {
			this.towerBtn3ToolTipBox.alpha = 0;
			this.towerBtn3ToolTipText.alpha = 0;
			if (this.towerSelected != 3) {
				this.towerBtn3.setTexture('wTower3');
			}
		}.bind(this));

	}

	// Updates boss hp
	hpBar (x, y, curHp, totalHp) {
		this.bossHp.alpha = 1;
		this.bossHp.clear();
		this.bossHp = this.add.graphics();
		this.bossHp.fillStyle(0x666666, 0.8);
		this.bossHp.fillRect(x - 50, y - 180, 120, 10);
		this.events.emit('bossHpW', x, y, curHp, totalHp);
	}

	// Clears boss UI stuff at end of game
	hpBarClear () {
		this.bossHp.alpha = 0;
		this.bossHp.clear();
		this.gameClear = 1;
		this.events.emit('bossDeadW');
		this.events.emit('gameOverW');
		this.scene.start('Win');
	}
}
