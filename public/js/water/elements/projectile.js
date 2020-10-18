export default class Projectile extends Phaser.GameObjects.Image {
	constructor (scene, posX, posY) {
		super (scene, posX, posY, 'wBullet1');
		this.scene = scene;
		this.setScale(0.75);

		this.changeX = 0;
		this.changeY = 0;
		this.projTimer = 0;

		// Calculates speed to cover certain distance in a certain time (ms)
		this.projSpd = Phaser.Math.GetSpeed(600, 2);

		this.scene.add.existing(this);
	}

	update (time, change) {
		// Subtract until projectile disappears
		this.projTimer -= change;

		// Updates position of bullet and travel along a path
		this.x += this.changeX * (this.projSpd * change);
		this.y += this.changeY * (this.projSpd * change);

		// Removes Projectile
		if (this.projTimer <= 0) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

	attack (posX, posY, angle) {
		this.setActive(true);
		this.setVisible(true);

		// angles projectile
		this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;

		// Sets position of projectile
		this.setPosition(posX, posY);

		// Calc trajectory / path of projectile
		this.changeX = Math.cos(angle);
		this.changeY = Math.sin(angle);

		// Controls how long the projectile stay on map
		this.projTimer = 800;
	}
}
