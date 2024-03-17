const { readdirSync } = require('fs');

const authMiddleware = require('../middlewares/auth.middleware');
const path = require('path');

module.exports = function (router) {
	router.post('/api/*', authMiddleware);
	router.put('/api/*', authMiddleware);

	router.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, '../public/index.html'));
	});

	const routerFiles = readdirSync(__dirname).filter(file => file.endsWith('route.js'));
	for (const file of routerFiles) {
		require(__dirname + '/' + file)(router);
	}
};
