const { parseDate } = require('../utils');
const Formatter = require('./formatter');
const { urls } = require('../../parser.config');

class PostFormatter extends Formatter {
	constructor({ rutrackerId, categoryId }, rawHTML) {
		super(rawHTML);

		if (!rutrackerId) throw new Error('postId is required');
		this.postId = rutrackerId;
		this.categoryId = categoryId || null;

		this.postURL = urls.postPageURL + rutrackerId;
	}

	format() {
		console.log(`[#] Trying to extract post data...`.gray);

		return {
			rutrackerId: this.postId,
			rutrackerURL: this.postURL,

			title: this.getTitle(),
			description: this.getDescription(),
			publishDate: this.getPublishDate(),
			author: this.getAuthor(),
			magnetURL: this.getMagnetURL(),
			downloadTorrentURL: this.getDownloadTorrentURL(),
			thanksList: this.getThanksList(),

			categoryId: this.categoryId
		};
	}

	getTitle() {
		const title = this.html('.post_body').find('span').first().text();
		return title === '' ? null : title;
	}

	getDescription() {
		const textNodes = [];

		this.html('.post_body')
			.contents()
			.each((i, e) => {
				let value =
					e.nodeType === 3
						? e.nodeValue.replace(/\n|\r|\t|: /g, '')
						: this.html(e)
								.text()
								.replace(/\n|\r|\t|: /g, '');

				if (value !== '' && value !== ':') {
					textNodes.push(value);
				}
			});

		const startIndex = textNodes.findIndex(e => e.startsWith('Описание'));
		if (startIndex < 1) return null;

		return textNodes.slice(startIndex + 1, startIndex + 2).join(' ');
	}

	getPublishDate() {
		return parseDate(this.html('.p-link.small').text());
	}

	getAuthor() {
		let rutrackerId, rutrackerURL;

		const profileURL = this.html(`a[href^='profile.php'].txtb:first()`).attr('href') || null;
		if (!profileURL) {
			rutrackerId = null;
			rutrackerURL = null;
		} else {
			rutrackerId = profileURL.split('=')[2];
			rutrackerURL = urls.profilePageURL + rutrackerId;
		}

		const username = this.html('.nick.nick-author').text();

		return { rutrackerId, rutrackerURL, username };
	}

	getMagnetURL() {
		return this.html('.med.magnet-link').attr('href') || null;
	}

	getDownloadTorrentURL() {
		const url = this.html('.dl-stub.dl-link.dl-topic').attr('href');
		if (!url) return null;

		return urls.downloadTorrentURL + url.split('=')[1];
	}

	getThanksList() {
		const thankList = [];

		this.html('#thx-list a').each((index, element) => {
			const username = this.html('b', element)
				.contents()
				.filter((i, el) => el.nodeType === 3)
				.text()
				.trim();

			const userId = this.html('u', element).text().trim();
			const thankDate = parseDate(
				this.html('i', element).text().replace('(', '').replace(')', '').trim()
			);

			thankList.push({
				username: username,
				rutrackerId: userId,
				rutrackerURL: urls.profilePageURL + userId,
				thankDate: thankDate
			});
		});

		return thankList;
	}
}

module.exports = PostFormatter;
