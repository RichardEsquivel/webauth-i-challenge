const bcrypt = require('bcryptjs');
const router = require('express').Router();

const authRouter = require('../auth/auth-router.js')
const usersRouter = require('../users/users-router.js')

router.use('/auth', authRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => {
	res.json({ api: "I think it's alive!" });
});

router.post('/hash', (req, res) => {
	//read a password passed in the JSON body
	const password = req.body.password;


	//hash the password using bcryptjs
	const hash = bcrypt.hashSync(password, 14);

	//show the password back to the user as a demo using an object
	res.status(200).json({ coolPassword: password, WoahThatsCooler: hash })
});

module.exports = router;