export default class Alien extends Phaser.GameObjects.Image {
	constructor (scene, objX, objY, path) {
		super(scene, objX, objY, 'alien_green');

		// Grabs variables
		this.scene = scene;
		this.path = path;

		// Enemy Attributes
		this.hitpoints = 0;
		this.speed = 0;
		this.pathFollower = {pathPos: 0, vec: new Phaser.Math.Vector2()};

		//add enemy
		this.scene.add.existing(this);
	}

	// Called every time update is called within the scene
	// Keep enemy logic here
	update (pathPos, change) {
		// Move obj & update position
		this.pathFollower.pathPos += this.speed * change;
		this.path.getPoint(this.pathFollower.pathPos, this.pathFollower.vec);

		/*
		// rotate img
		if (this.pathFollower.vec.y > this.y && this.pathFollower.vec.y !== this.y) {
			this.angle = 90;
		}

		if (this.pathFollower.vec.x > this.x && this.pathFollower.vec.x !== this.x) {
			this.angle = 0;
		}*/

		this.setPosition(this.pathFollower.vec.x, this.pathFollower.vec.y);

		// Check if alien hit tower
		if (this.pathFollower.pathPos >= 1) {
			this.setActive(false);
			this.setVisible(false);

			// Update Castle health
		}
	}

	spawn (hpMultiplier, spdMultiplier) {
		// Setup Obj
		/*
			We can probably export these into a config file? Have it change that way...
		*/
		this.speed =  (1/50000) * spdMultiplier;
		this.hitpoints = 100 + hpMultiplier;
		this.pathFollower.pathPos = 0;

		// Grab path info (Grabs x & y of line)
		this.path.getPoint(this.pathFollower.pathPos, this.pathFollower.vec);

		// Pos
		this.setPosition(this.pathFollower.vec.x, this.pathFollower.vec.y);
	}

	// When enemy gets hit, take damage
	damage (dmg) {
		this.hitpoints -= dmg;

		// death
		if (this.hitpoints <= 0) {
			this.setActive(false);
			this.setVisible(false);

			// Update currency + score
		}
	}
}