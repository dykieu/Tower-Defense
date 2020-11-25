export default class AlienBoss extends Phaser.GameObjects.Image {
	constructor (scene, objX, objY, path) {
		super(scene, objX, objY, 'vboss');
		this.setScale(2.5);
		// Grabs variables
		this.scene = scene;
		this.path = path;

		// Enemy Attributes
		this.hitpoints = 0;
		this.totalHp = this.hitpoints;
		this.speed = 0;
		this.pathFollower = {pathPos: 0, vec: new Phaser.Math.Vector2()};

		//add enemy
		this.scene.add.existing(this);
	}

	update (pathPos, change) {
		// Move obj & update position
		this.pathFollower.pathPos += this.speed * change;
		this.path.getPoint(this.pathFollower.pathPos, this.pathFollower.vec);

		// Change this back to no -75 (only for boss right now)
		this.setPosition(this.pathFollower.vec.x, this.pathFollower.vec.y - 75);

		// hp update
		this.scene.hpBar(this.pathFollower.vec.x, this.pathFollower.vec.y, this.hitpoints, this.totalHp);

		// Check if alien hit castle
		if (this.pathFollower.pathPos >= 1) {
			this.setActive(false);
			this.setVisible(false);

			// Update Castle health (Sends how much dmg to take)
			this.scene.decHealth(1000);
			this.scene.hpBarClear();
		}
	}

	spawn (hpMultiplier, spdMultiplier) {
		// Setup Obj
		/*
			We can probably export these into a config file? Have it change that way...
		*/
		this.speed =  (1/50000) * spdMultiplier;
		this.hitpoints = (hpMultiplier * 100);
		this.totalHp = this.hitpoints;
		this.pathFollower.pathPos = 0;

		// Grab path info (Grabs x & y of line)
		this.path.getPoint(this.pathFollower.pathPos, this.pathFollower.vec);

		// Pos
		this.setPosition(this.pathFollower.vec.x, this.pathFollower.vec.y);

		// hp update
		this.scene.hpBar(this.pathFollower.vec.x, this.pathFollower.vec.y, this.hitpoints, this.totalHp);
		
	}

	// When enemy gets hit, take damage
	damage (dmg) {
		this.hitpoints -= dmg;

		// hp update
		console.log('update hp bar');
		this.scene.hpBar(this.pathFollower.vec.x, this.pathFollower.vec.y, this.hitpoints, this.totalHp);

		// death
		if (this.hitpoints <= 0) {
			this.setActive(false);
			this.setVisible(false);

			this.scene.hpBarClear();
			//this.scene.gameClear();

			// Update currency + score
			this.scene.incScore(200);
			this.scene.addGold(2);
		}
	}
}
