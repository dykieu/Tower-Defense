export default class TowerSC extends Phaser.GameObjects.Image {
	constructor (scene, posX, posY, gridObj) {
		super (scene, posX, posY, 'wTower2');
		//this.setScale(1.15);
		this.scene = scene;
		this.grid = gridObj;
		this.attTimer = 0;
		this.scene.add.existing(this);
	}

	update (time, change) {
		if (time > this.attTimer) {
			this.attack();
			this.attTimer = time + 300;
		}
	}

	placeTower (posX, posY) {
		this.x = posX * 64 + 32;
		this.y = posY * 64 + 32;
		this.grid[posX][posY] = 1;
	}

	attack () {
		// Finds enemy (x,y,attack radius)
		let alien = this.scene.findAlien(this.x, this.y, 250);
		if (alien) {
			let angle = Phaser.Math.Angle.Between(this.x, this.y, alien.x, alien.y);
			this.scene.fireProjectile(this.x, this.y, angle, 2);

			// If we decide to use a directional top down tower sprite (The tower will rotate)
			//this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
		}
	}
}
