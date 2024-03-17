const Formatter = require('./formatter');
const { urls } = require('../../parser.config');

class SubcategoryFormatter extends Formatter {
	constructor(subcategoryId, rawHTML) {
		super(rawHTML);

		if (!subcategoryId) throw new Error('subcategoryId is required');
		this.subcategoryId = subcategoryId;

		this.subcategoryURL = urls.subcategoryPageURL + subcategoryId;
	}

	format() {
		console.log(`[#] Trying to extract subcategory data...`.gray);

		return {
			rutrackerId: this.subcategoryId,
			rutrackerURL: this.subcategoryURL,

			posts: this.getPosts()
		};
	}

	getPosts() {
		const posts = [];

		this.html('.torTopic.tt-text').each((i, e) => {
			const postElement = this.html(e);

			posts.push({
				rutrackerId: postElement.attr('href').split('=')[1].replace('&view', ''),
				title: postElement.text().trim(),
				categoryId: this.subcategoryId
			});
		});

		console.log('Parsed ' + posts.length + ' Posts');

		return posts;
	}
}

module.exports = SubcategoryFormatter;
