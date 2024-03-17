const { writeFileSync } = require('fs');
const colors = require('colors');
const { ensureDir } = require('fs-extra');

const { jsonOutput, defaultSubcategoryId } = require('./parser.config');
const { insertPostToDB } = require('./parser/utils');

const { SubcategoryLoader, PostLoader } = require('./parser/loaders');
const { SubcategoryFormatter, PostFormatter } = require('./parser/formatters');

const db = require('./database');

(async () => {
	await db;

	console.log('[...] Started'.yellow);
	console.time('parser-working-time');

	const args = process.argv.slice(2);
	let subcategoryId = args.find(arg => arg.startsWith('id='));
	if (!subcategoryId) {
		subcategoryId = defaultSubcategoryId;
		console.log(
			`[INFO] "id" is not provided. Parsing with default subcategory id (${defaultSubcategoryId})`
				.cyan
		);
	} else subcategoryId = subcategoryId.split('=')[1];

	try {
		console.log(`[#] Loading subcategory: ${subcategoryId}`.gray);
		const rawHTML = await new SubcategoryLoader(subcategoryId).load();
		const subcategory = new SubcategoryFormatter(subcategoryId, rawHTML).format();

		await ensureDir('./parser/out/posts');

		for (const { rutrackerId, categoryId } of subcategory.posts) {
			try {
				const JSONOutputPath = `./parser/out/posts/post-${rutrackerId}.json`;

				console.log(`[#] Post: ${rutrackerId}`.gray);

				const rawHTML = await new PostLoader(rutrackerId).load();
				const rawJSON = new PostFormatter({ rutrackerId, categoryId }, rawHTML).format();
				if (jsonOutput) {
					await writeFileSync(JSONOutputPath, JSON.stringify(rawJSON, null, 4));
					console.log(`[INFO] JSON output has been written to ${JSONOutputPath}`.cyan);
				}

				await insertPostToDB(rawJSON);
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
