/*
	Game Script
*/

console.log('Loaded game script');
window.onload = () => {
	// Grabs url and checks that we're in the game tab before rendering game
	let path = window.location.pathname;
	if (path == '/game') {
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

		}

		function create() {

		}

		function update() {

		}

	}
};