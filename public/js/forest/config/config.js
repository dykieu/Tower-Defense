// Game Start Settings
export default {
	type: Phaser.AUTO,
	parent: "HTML5-Tower-Defense",
	width: 1280,
	height: 960,
	pixelArt: true,
	roundPixels: true,
	physics: {
		default: 'arcade',
		arcade: {
			// Turn this off when we're finished to remove purple lines
			debug: false,
			gravity: {y: 0}
		}
	}
};