const puppeteer = require('puppeteer');

const { sessionCookie, urls } = require('../../parser.config');

class Loader {
	constructor() {}

	async loadBrowser() {
		this.browser = await puppeteer.launch();
	}

	async createNewPage() {
		const page = await this.browser.newPage();

		await page.setCookie({
			name: 'bb_session',
			value: sessionCookie,
			domain: urls.domain,
			path: '/',
			expires: Date.now() + 86400000
		});

		return page;
	}

	async destroyBrowser() {
		return this.browser.close();
	}
}

module.exports = Loader;
