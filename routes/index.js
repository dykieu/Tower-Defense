const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
	return res.render('index');
});

module.exports = router;