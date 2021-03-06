/*
	
*/
export default class GameOverScene extends Phaser.Scene {
	constructor() {
		super('GameOver');
	}

	create() {
		// Create Game Objects
		this.createMessage();
		this.createPlayBtn();

	}

	createMessage () {
		// Create a title image
		this.titleImage = this.add.image(0,0, 'gameover');
		this.centerObj(this.titleImage, 3);
	}

	createPlayBtn () {
		// Game Buttons
		this.gameButton = this.add.sprite(0, 0, 'redBtn').setInteractive();
		this.gameButton.setScale(0.25);
		this.centerObj(this.gameButton, 1);

		this.gameText = this.add.text(0, 0, 'Back to Menu', {
			fontSize: '24px',
			fill: '#fff'
		});

		// Aligns 1 game object into another game obj
		Phaser.Display.Align.In.Center(
			this.gameText,
			this.gameButton
		);

		this.gameButton.on('pointerdown', function (pointer) {
			this.scene.start('Title');
		}.bind(this));
	
		// When Hovering over a button, change its image/color
		this.gameButton.on('pointerover', function (pointer) {
			this.gameButton.setTexture('redBtnHover');
		}.bind(this));
	
		this.gameButton.on('pointerout', function (pointer) {
			this.gameButton.setTexture('redBtn');
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