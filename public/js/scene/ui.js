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
		this.game = this.scene.get('Forest');
	}
	
	create() {
		this.setupUI();
		this.listenEvents();
	}

	setupUI () {
		// Score Keeper
		this.score = this.add.text(1150, 10, 'Score: 0', {
			fontSize: '18px',
			fill: '#FFFFFF'
		});

		this.score.alpha = 0;

		// Castle Health
		this.hpBarTxt = this.add.text(395, 50, 'Health: 100', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.hpBarTxt.alpha = 0;

		this.healthBar = this.add.graphics();
		this.healthBar.fillStyle(0xFF0000, 0.8);
		this.healthBar.fillRect(395, 10, 490, 20);
		this.healthBar.alpha = 0;

		this.healthBarPercText = this.add.text(620, 12, '100%', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.healthBarPercText.alpha = 0;

		this.goldAmount = this.add.text(395, 80, 'Gold: 8', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.goldAmount.alpha = 0;

		this.waveText = this.add.text(735, 200, 'Wave: 0 ', {
			fontSize: '48px',
			fill: '#fff'
		});
		this.waveText.alpha = 0;

		this.waveIndicator = this.add.text(755, 80, 'Wave: 0 ', {
			fontSize: '18px',
			fill: '#fff'
		});
		this.waveIndicator.alpha = 0;

		this.waveStatus1 = this.add.text(840, 50, 'OFF', {
			fontSize: '18px',
			fill: '#FF0000'
		});
		this.waveStatus1.alpha = 0;

		this.waveStatus2 = this.add.text(755, 50, 'Status: ', {
			fontSize: '18px',
			fill: '#FFF'
		});
		this.waveStatus2.alpha = 0;

		this.waveStatus3 = this.add.text(840, 50, 'ON', {
			fontSize: '18px',
			fill: '#66ff00'
		});
		this.waveStatus3.alpha = 0;

		this.bossHealthBar = this.add.graphics();
		this.bossHealthBar.fillStyle(0xFF0000, 0.8);
		this.bossHealthBar.fillRect(0, 0, 115, 5);
		this.bossHealthBar.alpha = 0;
	}

	listenEvents () {
		// If scene has getUI event, display UI
		this.game.events.on('getUI', function () {
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
		this.game.events.on('incScore', function (score) {
			this.score.setText('Score: ' + score);
		}.bind(this));

		this.game.events.on('decHp', function (newHp, totalHp) {
			this.hpBarTxt.setText('Health: ' + newHp);
			this.healthBarPercText.setText(parseInt((newHp / totalHp) * 100) + '%');
			let newHpVal = 490 * (newHp / totalHp);
			this.healthBar.clear();
			this.healthBar.fillStyle(0xFF0000, 0.8);
			this.healthBar.fillRect(395, 10, newHpVal, 20);
		}.bind(this));

		this.game.events.on('gold', function (newGold) {
			this.goldAmount.setText('Gold: ' + newGold);
		}.bind(this));

		this.game.events.on('displayWave', function (waveNum) {
			this.waveText.setText('Wave: ' + waveNum);
			this.waveIndicator.setText('Wave: ' + waveNum);
			this.waveIndicator.alpha = 1;
			this.waveText.alpha = 1;
		}.bind(this));

		this.game.events.on('nextWave', function () {
			this.waveText.alpha = 0;
		}.bind(this));

		this.game.events.on('waveON', function () {
			this.waveStatus2.alpha = 1;
			this.waveStatus3.alpha = 1;
			this.waveStatus1.alpha = 0;
		}.bind(this));

		this.game.events.on('waveOFF', function () {
			this.waveStatus2.alpha = 1;
			this.waveStatus3.alpha = 0;
			this.waveStatus1.alpha = 1;
		}.bind(this));

		this.game.events.on('gameOver', function () {
			this.score.alpha = 0;
			this.hpBarTxt.alpha = 0;
			this.healthBar.alpha = 0;
			this.healthBarPercText.alpha = 0;
			this.goldAmount.alpha = 0;
			this.waveStatus2.alpha = 0;
			this.waveIndicator.alpha = 0;
			this.waveStatus1.alpha = 0;
			this.waveStatus3.alpha = 0;
		}.bind(this));

		this.game.events.on('bossHp', function (x, y, newHp, totalHp) {
			let newHpVal = 115 * (newHp / totalHp);
			this.bossHealthBar.clear();
			this.bossHealthBar.fillStyle(0xFF0000, 0.8);
			this.bossHealthBar.fillRect(x - 47.5, y - 177.5, newHpVal, 5);
			this.bossHealthBar.alpha = 1;
		}.bind(this));

		this.game.events.on('bossDead', function () {
			this.bossHealthBar.clear();
			this.bossHealthBar.alpha = 0;
		}.bind(this));
	}
}