const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
	let user = req.body;
	const hash = bcrypt.hashSync(user.password, 14); // 2 ^ n
	user.password = hash;

	Users.add(user)
		.then(saved => {
			res.session.username = saved.username;// allow the user to now be logged in and not make them log in again.
			res.status(201).json(saved);
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.username = user.username; //good add properties to the existing user object don't overide session objects that are being used by other parts of the application
				res.status(200).json({
					message: `Welcome ${user.username}!`,
				});
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

router.get('/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(error => {
			if (error) {
				res.status(500).json({
					message: "You are stuck here, sorry no logout!"
				});
			} else {
				res.status(200).json({ message: "Logged out now!" })
			}
		})
	}
})

module.exports = router;
