const { model } = require('mongoose');
const { OperationError } = require('../utils/errors.util');

async function getUser(req, res) {
	const { userId } = req.params;

	try {
		const user = await model('User').findById(userId);
		if (!user) return res.json(new NotFoundError('User not found').toJSON());

		return res.json(user);
	} catch (error) {
		return res.json(new IncorrectDataError('Invalid userId').toJSON());
	}
}

async function createUser(req, res) {
	try {
		const userData = req.body;

		const result = await model('User').getOrCreate(userData);
		return res.json({ success: true, result: result });
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json({ success: false, error: error.toJSON() });
		} else throw error;
	}
}

/**
 * TODO: Add updateUser handler
 */
async function updateUser(req, res) {
	res.json({ type: 'updateUser', data: {} });
}

module.exports = {
	getUser,
	createUser,
	updateUser
};
