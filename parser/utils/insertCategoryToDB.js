const { model } = require('mongoose');

module.exports = async function (categoryData) {
	const category = await model('Category').getOrCreate({
		rutrackerId: categoryData.rutrackerId,
		rutrackerURL: categoryData.rutrackerURL,
		name: categoryData.name,
		type: 'category'
	});

	await Promise.all(
		categoryData.subcategories.map(async sObject => {
			/**
			 * sObject: {
			 *    rutrackerId: String,
			 *    rutrackerURL: String,
			 *    name: String,
			 *    parentId: String
			 * }
			 */
			const subcategory = await model('Category').getOrCreate({
				rutrackerId: sObject.rutrackerId,
				rutrackerURL: sObject.rutrackerURL,
				name: sObject.name,
				type: 'subcategory',
				parentId: sObject.parentId
			});

			return subcategory.id;
		})
	);

	return category;
};
