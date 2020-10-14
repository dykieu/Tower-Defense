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
		this.createLoadingBar();

		// Duration for logo to stay on screen (time in ms, function to call, array of arguements, scope)
		// set to low delay for debug purposes right now
		this.timedEvent = this.time.delayedCall(1, this.ready, [], this);

		this.loadGameAssets();
	}

	createLoadingBar () {
		// Detect Main camera and grabs width and heigh of screen
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;

		// Adjustment values for loading elements
		let logoAdj = 300;
		let loadBoxAdj = logoAdj * 0.5;
		let loadMsgAdj = logoAdj - (logoAdj * 1.25);
		let percMsgAdj = loadBoxAdj * 0.825;
		let assMsgAdj = logoAdj - (logoAdj * 1.15);
		let progBarAdj = loadBoxAdj - 10;

		// Logo Img (We can make one for our group, just using my stock image for now)
		let logoImg = this.add.image(screenWidth / 2, screenHeight / 2 - logoAdj, 'logo');
		logoImg.setScale(0.5);
		console.log(((screenHeight / 10 ) * 4));

		// Creates a loading bar for assets (add.graphics lets us create assets without existing files)
		let loadBar = this.add.graphics();
		let loadBox = this.add.graphics();

		// Background box (color, opacity)
		loadBox.fillStyle(0x666666, 0.8);

		// (posX, posY, box Width, box Height)
		loadBox.fillRect(screenWidth / 2 - 160, screenHeight / 2 - loadBoxAdj, 320, 50);

		// Load message
		let loadTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 + loadMsgAdj,
			text: 'Loading Game...',
			style: {
				font: '24px Monserrat',
				fill: '#ffffff'
			}
		});

		// Centers message (Puts origin in middle of text instead of at corner)
		loadTxt.setOrigin(0.5, 0.5);

		// load bar percentage
		let prcTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 - percMsgAdj,
			text: '0%',
			style: {
				font: '24px Monserrat',
				fill: '#ffffff'
			}
		});

		prcTxt.setOrigin(0.5, 0.5);

		// What asset it is current loading
		let assTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight /2 + assMsgAdj,
			text: '',
			style: {
				font: '14px Monserrat',
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
			loadBar.fillRect(screenWidth / 2 - 150, screenHeight / 2 - progBarAdj, 300 * val, 30);
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
	}

	loadGameAssets () {
		/**********************************************
					Load Game Assets Here
		**********************************************/
		// Base level testing assets
		this.load.image('logoImg', './Logo/ksdr.png');	
		this.load.image('title', './testAssets/title.png');

		this.load.image('redBtn', './UI/redBtn.png');
		this.load.image('redBtnHover', './UI/redBtn_hover.png');
		this.load.image('forestBtn', './UI/forestBtn2.png');
		this.load.image('forestBtnHover', './UI/forestBtn2_hover.png');	
		this.load.image('beachBtn', './UI/beachBtn.png');
		this.load.image('beachBtnHover', './UI/beachBtn_hover.png');
		this.load.image('villageBtn', './UI/villageBtn.png');
		this.load.image('villageBtnHover', './UI/villageBtn_hover.png');
		this.load.image('gameBtn', './UI/gameBtn.png');
		this.load.image('gameBtnHover', './UI/gameBtn_hover.png');
		this.load.image('woodTowerHover', './UI/woodTower_hover2.png');
		this.load.image('forestWave', './UI/forestWave.png');

		this.load.image('alien_green', './monster/alienG.png');
		this.load.image('alien_blue', './monster/alienB.png');
		this.load.image('alien_red', './monster/alienR.png');

		this.load.image('castle', './Tower/castle.png');
		this.load.image('selector', './UI/selector.png');

		// Basic Tower
		this.load.image('woodTower', './Tower/woodTower2.png');
		this.load.image('woodProjectile', './Tower/woodProjectile.png');

		// Test for loading bar (Imitate loading large amount of assets)
		this.load.image('logoImg2', './Logo/ksdr.png');
		for (let i = 0; i < 250; i++) {
			this.load.image('Img_'+ i * 2, './Logo/ksdr.png');
		}

		// Game Map Files (Forest Level)
		this.load.tilemapTiledJSON('map', './Background/forest/forest2.json');
		this.load.spritesheet('terrain', './Background/forest/forest_tiles.png', { frameWidth: 64, frameHeight: 64 });
	}

	ready() {
		this.readyCount++;
		if (this.readyCount === 2) {
			this.scene.start('Title');
		}
	}
}