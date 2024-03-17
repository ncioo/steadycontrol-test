const { model } = require('mongoose');
const { OperationError, NotFoundError, IncorrectDataError } = require('../utils/errors.util');

async function getPosts(req, res) {
	const { page, step, sortBy, showAll } = req.query;

	const result = await model('Post').getPosts({ parentId: null }, page, step, sortBy, showAll);

	return res.json(result);
}

async function getPost(req, res) {
	const { postId } = req.params;

	try {
		const post = await model('Post').findById(postId).select('-thanksList');
		if (!post) return res.json(new NotFoundError('Post not found').toJSON());

		return res.json(post);
	} catch (error) {
		return res.json(new IncorrectDataError('Invalid postId').toJSON());
	}
}

async function getAuthor(req, res) {
	const { postId } = req.params;

	try {
		const result = await model('Post').getAuthor(postId);
		return res.json(result);
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json(error.toJSON());
		} else throw error;
	}
}

async function getThanksList(req, res) {
	const { postId } = req.params;

	try {
		const post = await model('Post').findById(postId);

		return res.json(await post.getThanksList());
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json(error.toJSON());
		} else throw error;
	}
}

async function createPost(req, res) {
	const postData = req.body;

	try {
		const result = await model('Post').createPost(postData);
		return res.json({ success: true, result: result });
	} catch (error) {
		if (error instanceof OperationError) {
			return res.json({ success: false, error: error.toJSON() });
		} else throw error;
	}
}

/**
 * TODO: Add updatePost handler
 */
async function updatePost(req, res) {
	res.json({ type: 'updatePost', data: {} });
}

module.exports = {
	getPosts,
	getPost,
	getAuthor,
	getThanksList,
	createPost,
	updatePost
};
