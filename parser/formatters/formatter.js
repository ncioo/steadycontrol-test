const cheerio = require('cheerio');

class Formatter {
	constructor(rawHTML) {
		if (!rawHTML) throw new Error('rawHTML is required');
		this.html = cheerio.load(rawHTML);
	}
}

module.exports = Formatter;
