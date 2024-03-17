const postController = require('../controllers/post.controller');

module.exports = function (router) {
	router.get('/api/posts/', postController.getPosts);

	router.get('/api/post/:postId', postController.getPost);

	router.get('/api/post/:postId/author', postController.getAuthor);

	router.get('/api/post/:postId/thanks', postController.getThanksList);

	router.post('/api/posts', postController.createPost);

	router.put('/api/posts/:postId', postController.updatePost);
};
