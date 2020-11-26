/*
	Selecting game map
*/
export default class InstructionScene extends Phaser.Scene {
	constructor() {
		super('Instruction');
	}

    init (data) {
        this.bgm = data.menuBgm;
    }

	create() {
		// Create Game Objects
		this.createTitle();
		this.createMenuBox();

		// Change these buttons to their respective maps later on (TODO LATER)
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

		this.controlText = this.add.text(450, 300,
			'1. Press Play and select a Map.\n\n2. Use the build menu within the game\n	by left clicking menu.\
			\n\n3. Selecting a tower will allow you to\n place a tower.\n\n4. Use the ingame selector to position\n the\
			tower and left click to place.\n\n ** Towers will cost gold and require\n currency',{
				fontSize: '18px',
				fill: '#000'
			});

	}

	createTitle () {
		let screenWidth = this.cameras.main.width;
		let screenHeight = this.cameras.main.width;

		let menuTxt = this.make.text({
			x: screenWidth / 2,
			y: screenHeight / 2 - 500,
			text: 'Controls',
			style: {
				font: '32px Monserrat',
				fill: '#ffffff'
			}
		});

		// Centers message (Puts origin in middle of text instead of at corner)
		menuTxt.setOrigin(0.5, 0.5);
	}

	createBackBtn (btnName, btnHover, btnText, scene, index) {
        this.click = this.sound.add('click', {
            loop: false,
            volume: 1,
            delay: 0
        });

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
            this.click.play();
			this.scene.start(scene, {bgm: this.bgm});
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
