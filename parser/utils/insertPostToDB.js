const { model } = require('mongoose');

module.exports = async function (postData) {
	const category = await model('Category').getOrCreate({
		rutrackerId: postData.categoryId,
		type: 'subcategory'
	});

	/**
	 * author: {
	 *    rutrackerId: String,
	 *    rutrackerURL: String,
	 * 	  username: String
	 * }
	 */
	const author = await model('User').getOrCreate(postData.author);

	const thankedUsers = await Promise.all(
		postData.thanksList.map(async tObject => {
			/**
			 * tObject: {
			 *    rutrackerId: String,
			 *    rutrackerURL: String,
			 * 	  username: String,
			 *    thankDate: Date
			 * }
			 */
			const user = await model('User').getOrCreate({
				rutrackerId: tObject.rutrackerId,
				rutrackerURL: tObject.rutrackerURL,
				username: tObject.username
			});

			return {
				userId: user.id,
				thankDate: tObject.thankDate
			};
		})
	);

	return model('Post').createPost({
		rutrackerId: postData.rutrackerId,
		rutrackerURL: postData.rutrackerURL,
		title: postData.title,
		description: postData.description,
		publishDate: postData.publishDate,
		magnetURL: postData.magnetURL,
		downloadTorrentURL: postData.downloadTorrentURL,
		thanksList: thankedUsers,
		authorId: author.id,
		categoryId: category.id
	});
};
