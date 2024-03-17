const userController = require('../controllers/user.controller');

module.exports = function (router) {
	router.get('/api/user/:userId', userController.getUser);

	router.post('/api/users', userController.createUser);

	router.put('/api/user/:userId', userController.updateUser);
};
