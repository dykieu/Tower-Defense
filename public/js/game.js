/*
	Game Script
*/
console.log('Loaded game script');

window.onload = () => {
	// Grabs url and checks that we're in the game tab before rendering game
	console.log('Detected Game route');

	// Game start settings 
	const config = {
		type: Phaser.AUTO,
		parent: "HTML5-Tower-Defense",
		width: window.innerWidth / 1.5,
		height: window.innerHeight / 1.5,
		scene: {
			preload: preload,
			create: create,
			update: update
		}
	};

	let game = new Phaser.Game(config);
	function preload() {
		this.load.image('logoImg', './test.png');
	}

	function create() {
		let logo = this.add.image(400, 300, 'logoImg');
		this.tweens.add({
			targets: logo,
			y: 450,
			duration: 2000,
			ease: 'Power2',
			yoyo: true,
			loop: -1
		});
	}
	function update() {

	}
};