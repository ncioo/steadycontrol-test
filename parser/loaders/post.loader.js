const { wait } = require('../utils');
const Loader = require('./loader');

const { urls } = require('../../parser.config');

class PostLoader extends Loader {
	constructor(postId) {
		super();

		if (!postId) throw new Error('postId is required');
		this.postId = postId;

		this.postURL = urls.postPageURL + postId;
	}

	async load() {
		console.log(`[#] Trying to load post...`.gray);

		await this.loadBrowser();
		const page = await this.createNewPage();

		await page.goto(this.postURL, { waitUntil: 'networkidle2' });
		const html = await page.$('#topic_main tbody:nth-child(2)');

		try {
			await page.click('.sp-head.folded.sp-no-auto-open');
			await wait(2000);
		} catch (error) {
			console.warn('Post does not contain thanks list');
		}

		const rawHTML = await page.evaluate(el => el.innerHTML, html);

		await this.destroyBrowser();

		return rawHTML || null;
	}
}

module.exports = PostLoader;
