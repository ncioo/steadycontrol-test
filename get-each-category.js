const { writeFileSync } = require('fs');
const colors = require('colors');
const { ensureDir } = require('fs-extra');

const { jsonOutput } = require('./parser.config');
const { getCategories, insertCategoryToDB } = require('./parser/utils');

const { CategoryLoader } = require('./parser/loaders');
const { CategoryFormatter } = require('./parser/formatters');

const db = require('./database');

(async () => {
	await db;

	console.log('[...] Started'.yellow);
	console.time('parser-working-time');

	try {
		await ensureDir('./parser/out/categories');

		const categories = await getCategories();

		for (const { rutrackerId } of categories) {
			try {
				const JSONOutputPath = `./parser/out/categories/category-${rutrackerId}.json`;

				console.log(`[#] Category: ${rutrackerId}`.gray);

				const rawHTML = await new CategoryLoader(rutrackerId).load();
				const rawJSON = new CategoryFormatter(rutrackerId, rawHTML).format();
				if (jsonOutput) {
					writeFileSync(JSONOutputPath, JSON.stringify(rawJSON, null, 4));
					console.log(`[INFO] JSON output has been written to ${JSONOutputPath}`.cyan);
				}

				await insertCategoryToDB(rawJSON);
			} catch (error) {
				console.warn(error);
				continue;
			}
		}
	} catch (error) {
		console.warn(error);
	}

	console.timeEnd('parser-working-time');
	console.log('[OK] Completed'.green);

	process.exit();
})();
