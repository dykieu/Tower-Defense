// Game Start Settings
export default {
	type: Phaser.AUTO,
	parent: "HTML5-Tower-Defense",
	width: 1280,
	height: 920,
	pixelArt: true,
	roundPixels: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: {y: 0}
		}
	}
};