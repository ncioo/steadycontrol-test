const Loader = require('./loader');

const { urls } = require('../../parser.config');

class CategoryLoader extends Loader {
	constructor(categoryId) {
		super();

		if (!categoryId) throw new Error('categoryId is required');
		this.categoryId = categoryId;

		this.categoryURL = urls.categoryPageURL + categoryId;
	}

	async load() {
		console.log(`[#] Trying to load category...`.gray);

		await this.loadBrowser();
		const page = await this.createNewPage();

		await page.goto(this.categoryURL);
		const html = await page.$(`#c-${this.categoryId}.category`);

		const rawHTML = await page.evaluate(el => el.innerHTML, html);

		await this.destroyBrowser();

		return rawHTML || null;
	}
}

module.exports = CategoryLoader;
