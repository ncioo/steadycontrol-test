const domain = 'rutracker.org';

module.exports = {
	sessionCookie: '0-46806021-qU0XnFDRxyG59TmlX8jC',

	htmlOutput: false,
	jsonOutput: false,
	postsPagesParsingLimit: 3,

	//	Категория "Книги и журналы"
	defaultCategoryId: '25',
	//	Подкатегория "Программирование (книги)"
	defaultSubcategoryId: '1426',

	urls: {
		domain: domain,
		homePageURL: `https://${domain}/forum` + `/index.php`,
		categoryPageURL: `https://${domain}/forum` + `/index.php?c=`,
		subcategoryPageURL: `https://${domain}/forum` + `/viewforum.php?f=`,
		postPageURL: `https://${domain}/forum` + `/viewtopic.php?t=`,
		downloadTorrentURL: `https://${domain}/forum` + `/dl.php?t=`,
		profilePageURL: `https://${domain}/forum` + `/profile.php?mode=viewprofile&u=`
	}
};
