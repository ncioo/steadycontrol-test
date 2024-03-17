const Formatter = require('./formatter');
const { urls } = require('../../parser.config');

class CategoryFormatter extends Formatter {
	constructor(categoryId, rawHTML) {
		super(rawHTML);

		if (!categoryId) throw new Error('categoryId is required');
		this.categoryId = categoryId;

		this.categoryURL = urls.categoryPageURL + categoryId;
	}

	format() {
		console.log(`[#] Trying to extract category data...`.gray);

		return {
			rutrackerId: this.categoryId,
			rutrackerURL: this.categoryURL,

			name: this.getTitle(),

			subcategories: this.getSubcategories()
		};
	}

	getTitle() {
		return this.html('.cat_title a').text();
	}

	getSubcategories() {
		const subcategories = [];

		this.html('.sf_title a').each((i, e) => {
			const subcategoryElement = this.html(e);

			const subcategoryId = subcategoryElement.attr('href').split('=')[1];

			subcategories.push({
				rutrackerId: subcategoryId,
				rutrackerURL: urls.subcategoryPageURL + subcategoryId,

				name: subcategoryElement.text(),
				parentId: this.categoryId
			});
		});

		return subcategories;
	}
}

module.exports = CategoryFormatter;
