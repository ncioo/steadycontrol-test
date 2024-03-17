const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const dbReady = require('./database');
const { serverPort } = require('./server.config');

const router = require('express-promise-router')();
const mountRoutes = require('./server/routes');

(async () => {
	const app = express();

	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.json({ limit: '100mb' }));

	mountRoutes(router);

	app.use('/', router);

	const httpServer = http.createServer(app);

	await httpServer.listen(serverPort, console.log('Ready'));
})();
