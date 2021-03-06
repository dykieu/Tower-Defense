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

    createButton() {
        let btnName = 'redBtn';
        let btnText = 'continue...';
        let btnHover = 'redBtnHover';
        let index = 1;
        
        this.click = this.sound.add('click', {
            loop: false,
            volume: 1,
            delay: 0
        });

        // Game Buttons
		this.gameButton = this.add.sprite(0, 0, btnName).setInteractive();
		this.gameButton.setScale(0.25);
		this.centerObj(this.gameButton, index);

		this.gameText = this.add.text(0, 0, btnText, {
			fontSize: '24px',
			fill: '#fff'
		});

		// Aligns 1 game object into another game obj
		Phaser.Display.Align.In.Center(
			this.gameText,
			this.gameButton
		);

		this.gameButton.on('pointerdown', function (pointer) {
            this.click.play();
			this.scene.start('Title');
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton.on('pointerover', function (pointer) {
			this.gameButton.setTexture(btnHover);
		}.bind(this));
	
		this.gameButton.on('pointerout', function (pointer) {
			this.gameButton.setTexture(btnName);
		}.bind(this));
    }

	// Method to center title or game objects
	centerObj (gObj, offset = 0) {
		// Detect Main camera and grabs width and heigh of screen
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;

		// Move the object
		gObj.x = screenWidth / 2;
		gObj.y = screenHeight / 2 - offset * 100;
    }
    
	loadGameAssets () {
		// General Game Assets
		this.load.image('logoImg', './Logo/ksdr.png');	
		this.load.image('title', './Logo/title.png');
		this.load.image('redBtn', './UI/redBtn.png');
		this.load.image('redBtnHover', './UI/redBtn_hover.png');
		this.load.image('forestBtn', './UI/forestBtn2.png');
		this.load.image('forestBtnHover', './UI/forestBtn2_hover.png');	
		this.load.image('beachBtn', './UI/beachBtn.png');
		this.load.image('beachBtnHover', './UI/beachBtn_hover.png');
		this.load.image('villageBtn', './UI/villageBtn.png');
		this.load.image('villageBtnHover', './UI/villageBtn_hover.png');
		this.load.image('gameover', './UI/gameover.png');
		this.load.image('win', './UI/win.png');
        this.load.image('bossWave', './Forest/UI/bossWave.png');
        
        this.load.audio('mBGM', './Music/Menu.mp3');
        this.load.audio('fBGM', './Music/bgm1.mp3');
        this.load.audio('wBGM', './Music/bgm2.mp3');
        this.load.audio('vBGM', './Music/bgm3.mp3');
        this.load.audio('att1', './Music/Tower1.wav');
        this.load.audio('att2', './Music/Tower2.wav');
        this.load.audio('att3', './Music/Tower4.wav');
        this.load.audio('click', './Music/CLICK.wav');

		/**********************************************
			 Load Game Assets Here [Forest Level]
		**********************************************/
		// UI
		this.load.image('gameBtn', './Forest/UI/gameBtn.png');
		this.load.image('gameBtnHover', './Forest/UI/gameBtn_hover.png');
		this.load.image('forestWave', './Forest/UI/forestWave.png');
		this.load.image('selector', './Forest/UI/selector.png');
		this.load.image('castle', './Forest/Tower/castle.png');

		// Monster Assets
		this.load.image('alien_green', './Forest/monster/alienG.png');
		this.load.image('alien_blue', './Forest/monster/alienB.png');
		this.load.image('alien_red', './Forest/monster/alienR.png');
		this.load.image('alien_boss', './Forest/monster/boss.png');

		// Tower Assets
		this.load.image('woodTower', './Forest/Tower/bow.png');
		this.load.image('woodProjectile', './Forest/Tower/woodProjectile.png');
		this.load.image('scTower', './Forest/Tower/scTower.png');
		this.load.image('scProjectile', './Forest/Tower/scProjectile.png');
		this.load.image('flameTower', './Forest/Tower/flameTower.png');
		this.load.image('flameProjectile', './Forest/Tower/flameProjectile.png');
		this.load.image('woodTowerHover', './Forest/UI/bow_hover.png');
		this.load.image('scTowerHover', './Forest/UI/scTower_hover.png');
		this.load.image('flameTowerHover', './Forest/UI/flameTower_hover.png');

		// Game Map Files (Forest Level)
		this.load.tilemapTiledJSON('map', './Forest/Background/forest3.json');
		this.load.spritesheet('terrain', './Forest/Background/forest_tiles.png', { frameWidth: 64, frameHeight: 64 });

		/**********************************************
			 Load Game Assets Here [Water Level]
		**********************************************/
		// UI
		this.load.image('gameBtn', './Forest/UI/gameBtn.png');
		this.load.image('gameBtnHover', './Forest/UI/gameBtn_hover.png');
		this.load.image('forestWave', './Forest/UI/forestWave.png');
		this.load.image('selector', './Forest/UI/selector.png');
		this.load.image('wcastle', './Water/Tower/castle.png');

		// Monster Assets
		this.load.image('wenemy1', './Water/monster/enemy_one.png');
		this.load.image('wenemy2', './Water/monster/enemy_two.png');
		this.load.image('wenemy3', './Water/monster/enemy_three.png');
		this.load.image('wboss', './Water/monster/waterBoss.png');

		// Tower Assets
		this.load.image('wTower1', './Water/Tower/tower_one.png');
		this.load.image('wTower2', './Water/Tower/tower_two.png');
		this.load.image('wTower3', './Water/Tower/tower_three.png');
		this.load.image('wBullet1', './Water/Tower/bullet_one.png');
		this.load.image('wBullet2', './Water/Tower/bullet_two.png');
		this.load.image('wBullet3', './Water/Tower/bullet_three.png');
		
		this.load.image('wTower1Hover', './Water/UI/wt1_hover.png');
		this.load.image('wTower2Hover', './Water/UI/wt2_hover.png');
		this.load.image('wTower3Hover', './Water/UI/wt3_hover.png');

		// Game Map Files (Forest Level)
		this.load.tilemapTiledJSON('wmap', './Water/Background/water_map.json');
		this.load.spritesheet('wterrain', './Water/Background/water_terrain.png', { frameWidth: 64, frameHeight: 64 });

		/**********************************************
			 Load Game Assets Here [Village Level]
		**********************************************/
		// UI
		this.load.image('gameBtn', './Forest/UI/gameBtn.png');
		this.load.image('gameBtnHover', './Forest/UI/gameBtn_hover.png');
		this.load.image('forestWave', './Forest/UI/forestWave.png');
		this.load.image('selector', './Forest/UI/selector.png');
		this.load.image('vcastle', './Village/Tower/castle.png');
		this.load.image('vhome1', './Village/Tower/village_home_1.png');
		this.load.image('vhome2', './Village/Tower/village_home_2.png');
		this.load.image('vhome3', './Village/Tower/village_home_3.png');
		this.load.image('vhome4', './Village/Tower/village_home_4.png');

		// Monster Assets
		this.load.image('venemy1', './Village/monster/enemy_one.png');
		this.load.image('venemy2', './Village/monster/enemy_two.png');
		this.load.image('venemy3', './Village/monster/enemy_three.png');
		this.load.image('vboss', './Village/monster/villageBoss.png');

		// Tower Assets
		this.load.image('vTower1', './Village/Tower/tower_one.png');
		this.load.image('vTower2', './Village/Tower/tower_two.png');
		this.load.image('vTower3', './Village/Tower/tower_three.png');
		this.load.image('vBullet1', './Village/Tower/bullet_one.png');
		this.load.image('vBullet2', './Village/Tower/bullet_two.png');
		this.load.image('vBullet3', './Village/Tower/bullet_three.png');
		
		this.load.image('vTower1Hover', './Village/UI/vt1_hover.png');
		this.load.image('vTower2Hover', './Village/UI/vt2_hover.png');
		this.load.image('vTower3Hover', './Village/UI/vt3_hover.png');

		// Game Map Files (Forest Level)
		this.load.tilemapTiledJSON('vmap', './Village/Background/village_map.json');
		this.load.spritesheet('vterrain', './Village/Background/village_terrain.png', { frameWidth: 64, frameHeight: 64 });
	}

	ready() {
		this.readyCount++;
		if (this.readyCount === 2) {
			this.createButton();
		}
	}
}
