const categoryController = require('../controllers/category.controller');

module.exports = function (router) {
	router.get('/api/categories', categoryController.getCategories);

	router.get('/api/category/:categoryId', categoryController.getCategory);

	router.get('/api/category/:categoryId/subcategories', categoryController.getSubcategories);

	router.get('/api/category/:categoryId/posts', categoryController.getPosts);

	router.post('/api/categories', categoryController.createCategory);

	router.put('/api/category/:categoryId', categoryController.updateCategory);
};
