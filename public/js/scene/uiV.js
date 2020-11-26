/*
	UI FOR VILLAGE LEVEL
*/
export default class UIVScene extends Phaser.Scene {
	constructor() {
		// Runs scene in parallel
		super({key: 'UIV', active: true});
	}

	init () {
		// Listen for game event
		this.game = this.scene.get('Village');
	}
	
	create() {
		this.setupUI();
		this.listenEvents();
	}

	/*****************************************************
	 * 	
	 *	Function: Setup UI elements on ths Screen
	 * 	Receives: None
	 * 
	******************************************************/

	setupUI () {
		// Score Keeper
		this.score = this.add.text(1150, 10, 'Score: 0', {
			fontSize: '18px',
			fill: '#FFFFFF'
		});

		this.score.alpha = 0;

		// Castle Health
		this.hpBarTxt = this.add.text(15, 50, 'Health: 100', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.hpBarTxt.alpha = 0;

		// Health bar
		this.healthBar = this.add.graphics();
		this.healthBar.fillStyle(0xFF0000, 0.8);
		this.healthBar.fillRect(15, 10, 490, 20);
		this.healthBar.alpha = 0;

		// Health bar indicator
		this.healthBarPercText = this.add.text(240, 12, '100%', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.healthBarPercText.alpha = 0;

		// Gold indicator
		this.goldAmount = this.add.text(15, 80, 'Gold: 8', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.goldAmount.alpha = 0;

		// Wave Msg text
		this.waveText = this.add.text(35, 200, 'Wave: 0 ', {
			fontSize: '48px',
			fill: '#fff'
		});
		this.waveText.alpha = 0;

		// Wave indicator
		this.waveIndicator = this.add.text(315, 80, 'Wave: 0 ', {
			fontSize: '18px',
			fill: '#fff'
		});
		this.waveIndicator.alpha = 0;

		// Wave status
		this.waveStatus1 = this.add.text(405, 50, 'OFF', {
			fontSize: '18px',
			fill: '#FF0000'
		});
		this.waveStatus1.alpha = 0;

		this.waveStatus2 = this.add.text(315, 50, 'Status: ', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.waveStatus2.alpha = 0;

		this.waveStatus3 = this.add.text(405, 50, 'ON', {
			fontSize: '18px',
			fill: '#66ff00'
		});
		this.waveStatus3.alpha = 0;

		// Boss health bar
		this.bossHealthBar = this.add.graphics();
		this.bossHealthBar.fillStyle(0xFF0000, 0.8);
		this.bossHealthBar.fillRect(0, 0, 115, 5);
		this.bossHealthBar.alpha = 0;
	}

	/*****************************************************
	 * 	
	 *	Function: Change UI element Depending on events
	 				omitted
	 * 	Receives: UI parameters for specific elements
	 * 
	******************************************************/
	listenEvents () {
		// If scene has getUI event, display UI
		this.game.events.on('getUIV', function () {
			this.waveIndicator.setText('Wave: ' + 0);
			this.score.alpha = 1;
			this.hpBarTxt.alpha = 1;
			this.healthBar.alpha = 1;
			this.healthBarPercText.alpha = 1;
			this.goldAmount.alpha = 1;
			this.waveStatus2.alpha = 1;
			this.waveIndicator.alpha = 1;
			this.waveStatus1.alpha = 1;
		}.bind(this));

		// Update score for enemy killed
		this.game.events.on('incScoreV', function (score) {
			this.score.setText('Score: ' + score);
		}.bind(this));

		// Updates castle hp
		this.game.events.on('decHpV', function (newHp, totalHp) {
			this.hpBarTxt.setText('Health: ' + newHp);
			this.healthBarPercText.setText(parseInt((newHp / totalHp) * 100) + '%');
			let newHpVal = 490 * (newHp / totalHp);
			this.healthBar.clear();
			this.healthBar.fillStyle(0xFF0000, 0.8);
			this.healthBar.fillRect(15, 10, newHpVal, 20);
		}.bind(this));

		// Updates gold
		this.game.events.on('goldV', function (newGold) {
			this.goldAmount.setText('Gold: ' + newGold);
		}.bind(this));

		// Updates wave for user
		this.game.events.on('displayWaveV', function (waveNum) {
			this.waveText.setText('Wave: ' + waveNum);
			this.waveIndicator.setText('Wave: ' + waveNum);
			this.waveIndicator.alpha = 1;
			this.waveText.alpha = 1;
		}.bind(this));

		this.game.events.on('waveInitV', function(waveNum) {
			this.waveIndicator.setText('Wave: ' + waveNum);
			this.waveIndicator.alpha = 1;
		}.bind(this));

		// Turn off wave msg
		this.game.events.on('nextWaveV', function () {
			this.waveText.alpha = 0;
		}.bind(this));

		this.game.events.on('waveONV', function () {
			this.waveStatus2.alpha = 1;
			this.waveStatus3.alpha = 1;
			this.waveStatus1.alpha = 0;
		}.bind(this));

		// Updates wave status
		this.game.events.on('waveOFFV', function () {
			this.waveStatus2.alpha = 1;
			this.waveStatus3.alpha = 0;
			this.waveStatus1.alpha = 1;
		}.bind(this));

		// Things to do when game is over
		this.game.events.on('gameOverV', function () {
			this.waveIndicator.setText('Wave: ' + 0);
			this.score.alpha = 0;
			this.hpBarTxt.alpha = 0;
			this.healthBar.alpha = 0;
			this.healthBarPercText.alpha = 0;
			this.goldAmount.alpha = 0;
			this.waveStatus2.alpha = 0;
			this.waveIndicator.alpha = 0;
			this.waveStatus1.alpha = 0;
			this.waveStatus3.alpha = 0;
			this.waveText.alpha = 0;
		}.bind(this));

		// Updates boss hp
		this.game.events.on('bossHpV', function (x, y, newHp, totalHp) {
			let newHpVal = 115 * (newHp / totalHp);
			this.bossHealthBar.clear();
			this.bossHealthBar.fillStyle(0xFF0000, 0.8);
			this.bossHealthBar.fillRect(x - 47.5, y - 177.5, newHpVal, 5);
			this.bossHealthBar.alpha = 1;
		}.bind(this));

		// Updates on boss death
		this.game.events.on('bossDeadV', function () {
			this.bossHealthBar.clear();
			this.bossHealthBar.alpha = 0;
		}.bind(this));
	}
}