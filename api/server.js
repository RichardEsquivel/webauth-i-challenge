const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session)
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const KnexConnection = require('../database/dbConfig.js');


const server = express();
//configuring sessions and cookies here
const sessionConfiguration = {
	name: 'coolSesh', //default name is sid
	secret: process.env.COOKIE_SECRET || 'Who KNOWS TIGER?', //this should be set as an environment variable
	cookie: {
		maxAge: 1000 * 60 * 60, //valid for 1 hour in milliseconds
		secure: process.env.NODE_ENV === 'development' ? false : true,//do we send cookie over unsecure HTTP is what this indicates
		httpOnly: true, //prevent client javascript code from accessing the cookie
	},
	resave: false, //save sessions even when they have not changed doing this false avoids chatter to the data store
	saveUnitialized: true, //read about it on the docs to respect GDPR when agree to cookies that is when they reset value
	store: new KnexSessionStorage({
		knex: KnexConnection,
		clearInterval: 1000 * 60 * 10, //delete expired sessions every 10 minutes
		tablename: "user_sessions",
		sidfieldname: "id",
		createtable: true

	})

};
server.use(helmet());
server.use(express.json());
server.use(cors());//research "credentials:true" and "withCredentials when connecting from your REACT application"
server.use(session(sessionConfiguration)); //use the session middleware globally

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up', session: req.session });
});

module.exports = server;
