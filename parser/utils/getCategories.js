const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const { sessionCookie, urls } = require('../../parser.config');

module.exports = async function () {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.setCookie({
			name: 'bb_session',
			value: sessionCookie,
			domain: urls.domain,
			path: '/',
			expires: Date.now() + 86400000
		});

		await page.goto(urls.homePageURL);
		await page.waitForSelector('#categories-wrap');
		const categoriesHTML = await page.$('#categories-wrap');
		const rawHTML = await page.evaluate(el => el.innerHTML, categoriesHTML);

		await browser.close();

		const html = cheerio.load(rawHTML);
		const categories = [];

		html('.cat_title a').each((i, e) => {
			const categoryElement = html(e);

			categories.push({
				rutrackerId: categoryElement.attr('href').split('=')[1],
				name: categoryElement.text()
			});
		});

		return categories;
	} catch (error) {
		throw error;
	}
};
