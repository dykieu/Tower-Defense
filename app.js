const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const exLayouts = require('express-ejs-layouts');
const fs = require('fs');
const app = express();

// References
const indexRoute = require('./routes/index');
const { response } = require('express');

// Layout Setup for EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(exLayouts);

// Folder Routes
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets'));

// Server port
app.set('port', (process.env.PORT || 3000));

// Form parsing (Just incase we need it, probably not though)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Route Handling
app.use('/', indexRoute);

// Catching 404 errors
app.use((req, res, next) => {
	const err = new Error('File Not Found');
	err.status = 404;
	next(err);
});

// Error Handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// Starting the server
app.get('/', (req, res) => {
	let status = 'Server is running';
	res.send(status);
}).listen(app.get('port'), () => {
	console.log(`Visit application here: http://localhost:${app.get('port')}`);
});