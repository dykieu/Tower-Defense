/*
	Selecting game map
*/
export default class SelectScene extends Phaser.Scene {
	constructor() {
		super('Select');
	}

	create() {
		// Create Game Objects
		this.createTitle();
		this.createMenuBox();

		// Change these buttons to their respective maps later on (TODO LATER)
		this.createForestBtn('forestBtn', 'forestBtnHover', 'Forest Level', 'Forest', 3);
		this.createIslandBtn('beachBtn', 'beachBtnHover', 'Island Level', 'Island', 2);
		this.createVillageBtn('villageBtn', 'villageBtnHover', 'Village Level', 'Village', 1);
		this.createBackBtn('redBtn', 'redBtnHover', 'Back', 'Title', 0);

	}

	createMenuBox () {
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;
		let menuBar = this.add.graphics();
		let menuBox = this.add.graphics();

		menuBox.fillStyle(0xFFFFFF, 0.2);
		menuBox.fillRect(screenWidth / 2 - 260, screenHeight / 2 - 400, 520, 500);

		menuBar.fillStyle(0xFFFFFF, 0.7);
		menuBar.fillRect(screenWidth / 2 - 250, screenHeight / 2 - 390, 500, 480);
	}

	createTitle () {
		// Create a title image
		//this.titleImage = this.add.image(0,0, 'title');
		//this.centerObj(this.titleImage, 3);
	
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;

		let menuTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight / 2 - 500,
			text: 'Menu',
			style: {
				font: '32px Monserrat',
				fill: '#ffffff'
			}
		});

		// Centers message (Puts origin in middle of text instead of at corner)
		menuTxt.setOrigin(0.5, 0.5);
	}

	createForestBtn (btnName, btnHover, btnText, scene, index) {
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
			this.scene.start(scene);
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton.on('pointerover', function (pointer) {
			this.gameButton.setTexture(btnHover);
		}.bind(this));
	
		this.gameButton.on('pointerout', function (pointer) {
			this.gameButton.setTexture(btnName);
		}.bind(this));
	}

	createIslandBtn (btnName, btnHover, btnText, scene, index) {
		// Game Buttons
		this.gameButton1 = this.add.sprite(0, 0, btnName).setInteractive();
		this.gameButton1.setScale(0.25);
		this.centerObj(this.gameButton1, index);

		this.gameText1 = this.add.text(0, 0, btnText, {
			fontSize: '24px',
			fill: '#fff'
		});

		// Aligns 1 game object into another game obj
		Phaser.Display.Align.In.Center(
			this.gameText1,
			this.gameButton1
		);

		this.gameButton1.on('pointerdown', function (pointer) {
			this.scene.start(scene);
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton1.on('pointerover', function (pointer) {
			this.gameButton1.setTexture(btnHover);
		}.bind(this));
	
		this.gameButton1.on('pointerout', function (pointer) {
			this.gameButton1.setTexture(btnName);
		}.bind(this));
	}

	createVillageBtn (btnName, btnHover, btnText, scene, index) {
		// Game Buttons
		this.gameButton2 = this.add.sprite(0, 0, btnName).setInteractive();
		this.gameButton2.setScale(0.25);
		this.centerObj(this.gameButton2, index);

		this.gameText2 = this.add.text(0, 0, btnText, {
			fontSize: '24px',
			fill: '#fff'
		});

		// Aligns 1 game object into another game obj
		Phaser.Display.Align.In.Center(
			this.gameText2,
			this.gameButton2
		);

		this.gameButton2.on('pointerdown', function (pointer) {
			this.scene.start(scene);
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton2.on('pointerover', function (pointer) {
			this.gameButton2.setTexture(btnHover);
		}.bind(this));
	
		this.gameButton2.on('pointerout', function (pointer) {
			this.gameButton2.setTexture(btnName);
		}.bind(this));
	}

	createBackBtn (btnName, btnHover, btnText, scene, index) {
		// Game Buttons
		this.gameButton3 = this.add.sprite(0, 0, btnName).setInteractive();
		this.gameButton3.setScale(0.25);
		this.centerObj(this.gameButton3, index);

		this.gameText3 = this.add.text(0, 0, btnText, {
			fontSize: '24px',
			fill: '#fff'
		});

		// Aligns 1 game object into another game obj
		Phaser.Display.Align.In.Center(
			this.gameText3,
			this.gameButton3
		);

		this.gameButton3.on('pointerdown', function (pointer) {
			this.scene.start(scene);
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton3.on('pointerover', function (pointer) {
			this.gameButton3.setTexture(btnHover);
		}.bind(this));
	
		this.gameButton3.on('pointerout', function (pointer) {
			this.gameButton3.setTexture(btnName);
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
}
