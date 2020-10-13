/*
	Booting Up the game
*/
export default class UIScene extends Phaser.Scene {
	constructor() {
		// Runs scene in parallel
		super({key: 'UI', active: true});
	}

	init () {
		// Listen for game event
		this.game = this.scene.get('Game');
	}

	preload() {
	
	}
	
	create() {
		this.setupUI();
		this.listenEvents();
	}

	setupUI () {
		// Score Keeper
		this.score = this.add.text(1150, 10, 'Score: 0', {
			fontSize: '24px',
			fill: '#FFFFFF'
		});
		this.score.alpha = 0;

		// Castle Health
		this.hpBarTxt = this.add.text(10, 10, 'Health: 100', {
			fontSize: '24px',
			fill: '#000000'
		});
		this.hpBarTxt.alpha = 0;
	}

	listenEvents () {
		// If scene has getUI event, display UI
		this.game.events.on('getUI', function () {
			this.score.alpha = 1;
			this.hpBarTxt.alpha = 1;
		}.bind(this));

		// Update score for enemy killed
		this.game.events.on('incScore', function (score) {
			this.score.setText('Score: ' + score);
		}.bind(this));

		this.game.events.on('decHp', function (newHp) {
			this.hpBarTxt.setText('Health: ' + newHp);
		}.bind(this));

		this.game.events.on('gameOver', function () {
			this.score.alpha = 0;
			this.hpBarTxt.alpha = 0;
		}.bind(this));
	}
}