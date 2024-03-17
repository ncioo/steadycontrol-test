const { APIKey } = require('../../server.config');

module.exports = function (req, res, next) {
	const token = req.get('Authorization')?.split(' ')[1];

	if (token !== APIKey) res.sendStatus(403);
	else next();
};
