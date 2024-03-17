const Loader = require('./loader');
const { postsPagesParsingLimit, urls } = require('../../parser.config');

const postPerPage = 50;

class SubcategoryLoader extends Loader {
	constructor(subcategoryId) {
		super();

		if (!subcategoryId) throw new Error('subcategoryId is required');
		this.subcategoryId = subcategoryId;

		this.subcategoryURL = urls.subcategoryPageURL + subcategoryId;
	}

	async load() {
		console.log(`[#] Trying to load subcategory...`.gray);

		await this.loadBrowser();

		let rawHTML = '';
		let pageNumber = 1;

		while (pageNumber <= postsPagesParsingLimit) {
			rawHTML += await this.getPostsByPage(pageNumber);
			pageNumber++;
		}

		await this.destroyBrowser();

		return rawHTML || null;
	}

	async getPostsByPage(pageNumber) {
		const urlQuery = pageNumber === 1 ? '' : `&start=${(pageNumber - 1) * postPerPage}`;

		const page = await this.createNewPage();

		await page.goto(this.subcategoryURL + urlQuery);
		const html = await page.$(`.vf-table.vf-tor.forumline.forum`);

		const rawHTML = await page.evaluate(el => el.innerHTML, html);

		return rawHTML;
	}
}

module.exports = SubcategoryLoader;
