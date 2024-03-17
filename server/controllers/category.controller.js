const { model, Types } = require('mongoose');
const { OperationError, NotFoundError, IncorrectDataError } = require('../utils/errors.util');

async function getCategories(req, res) {
	const { page, step } = req.query;

	const result = await model('Category').getCategories({ parentId: null }, page, step);

	return res.json(result);
}

async function getCategory(req, res) {
	const { categoryId } = req.params;

	try {
		const category = await model('Category').findById(categoryId);
		if (!category) return res.json(new NotFoundError('Category not found').toJSON());

		return res.json(category);
	} catch (error) {
		return res.json(new IncorrectDataError('Invalid categoryId').toJSON());
	}
}

async function getSubcategories(req, res) {
	const { page, step } = req.query;
	const { categoryId } = req.params;

	try {
		const result = await model('Category').getCategories(
			{ parentId: new Types.ObjectId(categoryId) },
			page,
			step
		);
		return res.json(result);
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json(error.toJSON());
		} else throw error;
	}
}

async function getPosts(req, res) {
	const { page, step } = req.query;
	const { categoryId } = req.params;

	try {
		const result = await model('Post').getPosts(
			{ categoryId: new Types.ObjectId(categoryId) },
			page,
			step
		);
		return res.json(result);
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json(error.toJSON());
		} else throw error;
	}
}

async function createCategory(req, res) {
	const categoryData = req.body;

	try {
		const result = await model('Category').getOrCreate(categoryData);
		return res.json({ success: true, result: result });
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json({ success: false, error: error.toJSON() });
		} else throw error;
	}
}

/**
 * TODO: Add updateCategory handler
 */
async function updateCategory(req, res) {
	res.json({ type: 'updateCategory', data: {} });
}

module.exports = {
	getCategories,
	getCategory,
	getSubcategories,
	getPosts,
	createCategory,
	updateCategory
};
