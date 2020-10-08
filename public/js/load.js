/*
	Scene for loading Game Assets
*/
export default class LoadScene extends Phaser.Scene {
	constructor() {
		super('Load');
	}

	// Method that initiates before preload
	init() {
		this.readyCount = 0;
	}

	preload() {
		// Detect Main camera and grabs width and heigh of screen
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;

		// Logo Img (We can make one for our group, just using my stock image for now)
		this.add.image(screenWidth / 2, screenHeight / 2 - 200, 'logo');
		console.log(((screenHeight / 10 ) * 4));

		// Creates a loading bar for assets (add.graphics lets us create assets without existing files)
		let loadBar = this.add.graphics();
		let loadBox = this.add.graphics();

		// Background box (color, opacity)
		loadBox.fillStyle(0x666666, 0.8);

		// (posX, posY, box Width, box Height)
		loadBox.fillRect(screenWidth / 2 - 160, screenHeight / 2 - 50, 320, 50);

		// Load message
		let loadTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 + 50,
			text: 'Loading Game...',
			style: {
				font: '18px Monserrat',
				fill: '#ffffff'
			}
		});

		// Centers message (Puts origin in middle of text instead of at corner)
		loadTxt.setOrigin(0.5, 0.5);

		// load bar percentage
		let prcTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 - 25,
			text: '0%',
			style: {
				font: '18px Monserrat',
				fill: '#ffffff'
			}
		});

		prcTxt.setOrigin(0.5, 0.5);

		// What asset it is current loading
		let assTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 + 10,
			text: '',
			style: {
				font: '12px Monserrat',
				fill: '#ffffff'
			}
		});

		// Centers message (Puts origin in middle of text instead of at corner)
		assTxt.setOrigin(0.5, 0.5);

		// Update the loading bar (Listen the progress event emitted by phaser)
		this.load.on('progress', (val) => {
			prcTxt.setText(parseInt(val * 100) + '%');

			// clears anything on screen and draws progress bar
			loadBar.clear();
			loadBar.fillStyle(0x76A5AF, 1);
			loadBar.fillRect(screenWidth / 2 - 150, screenHeight / 2 - 40, 300 * val, 30);
		});

		this.load.on('fileprogress', (fileName) => {
			assTxt.setText(fileName.key);
		});

		// Remove elements upon completiong
		this.load.on('complete', function () {
			loadBar.destroy();
			loadBox.destroy();
			assTxt.destroy();
			prcTxt.destroy();
			loadTxt.destroy();
			this.ready();
		}.bind(this));

		// Duration for logo to stay on screen (time in ms, function to call, array of arguements, scope)
		// set to low delay for debug purposes right now
		this.timedEvent = this.time.delayedCall(1, this.ready, [], this);

		/**********************************************
					Load Game Assets Here
		**********************************************/
		// Level 1 Assets
		this.load.image('logoImg', './test.png');	
		this.load.image('title', './testAssets/title.png');
		this.load.image('groundTile', './testAssets/ground.png');
		this.load.image('redBtn', './testAssets/redBtn.png');
		this.load.image('redBtnHover', './testAssets/redBtnHover.png');	
		this.load.image('roadTile', './testAssets/road.png');	
		this.load.image('tower_basic', './testAssets/tower.png');	
		this.load.image('alien_green', './testAssets/enemy.png');
		this.load.image('bullet_basic', './testAssets/bullet.png');

		// Test for loading bar
		this.load.image('logoImg2', './test.png');
		for (let i = 0; i < 500; i++) {
			this.load.image('logoImg'+ i * 2, './test.png');
		}

		// Game Map Files
		this.load.tilemapTiledJSON('forest', './testAssets/floor/map.json');
		this.load.spritesheet('terrain', './testAssets/floor/terrain.png', { frameWidth: 64, frameHeight: 64});
	}

	ready() {
		this.readyCount++;
		if (this.readyCount === 2) {
			this.scene.start('Title');
		}
	}
}