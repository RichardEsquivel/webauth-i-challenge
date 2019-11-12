const router = require('express').Router();

const Users = require('./users-model.js');
const requiresAuth = require('../auth/requires-auth-middleware.js');

router.get('/', requiresAuth, (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(error => {
			console.log('login error', error);
			res.status(500).json(error);
		});
})
module.exports = router;
