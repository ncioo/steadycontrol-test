const { model, Schema, Types } = require('mongoose');
const { NotFoundError } = require('../utils/errors.util');

const postSchema = new Schema({
	rutrackerId: { type: String },
	rutrackerURL: { type: String },

	title: { type: String, default: 'Нет оглавления' },
	description: { type: String, default: 'Нет описания' },
	publishDate: { type: Date },
	magnetURL: { type: String },
	downloadTorrentURL: { type: String },
	thanksList: [
		{
			userId: { type: Types.ObjectId, ref: 'User' },
			thankDate: { type: Date }
		}
	],

	//  Автор поста - пользователь
	authorId: { type: Types.ObjectId, ref: 'User' },
	//  Категория/Подкатегория поста
	categoryId: { type: Types.ObjectId, ref: 'Category' },

	createdAt: { type: Date, default: Date.now },
	deleted: { type: Boolean, default: false }
});

postSchema.methods.getThanksList = async function () {
	await this.populate('thanksList.userId');
	return this.thanksList;
};

postSchema.statics.getPosts = async function (
	findQuery,
	page = 1,
	step = 15,
	sortBy = 'date.desc',
	showAll = false
) {
	if (typeof page !== 'number') page = +page;
	if (typeof step !== 'number') step = +step;
	if (typeof showAll !== 'boolean') showAll = !!showAll;

	const sotringTypes = {
		/**
		 * TODO: Add more sorting methods
		 */
		'date.desc': { createdAt: -1 },
		'date.asc': { createdAt: 1 }
	};

	if (!showAll) findQuery.deleted = false;

	const result = await this.aggregate([
		{
			$match: findQuery
		},
		{ $sort: sotringTypes[sortBy] },
		{ $skip: (page - 1) * step },
		{ $limit: step }
	]);

	const filteredResult = result.map(post => {
		const { thanksList, ...filteredPost } = post;
		return filteredPost;
	});

	return filteredResult;
};

postSchema.statics.getAuthor = async function (rutrackerId) {
	const post = await model('Post').findById(rutrackerId);
	if (!post) throw new NotFoundError('Post not found');

	const author = await model('User').findById(post.authorId);
	if (!author) throw new NotFoundError('User not found');

	return author;
};

postSchema.statics.createPost = async function (postData) {
	const {
		rutrackerId,
		rutrackerURL,
		title,
		description,
		publishDate,
		magnetURL,
		downloadTorrentURL,
		thanksList,
		authorId,
		categoryId
	} = postData;

	const author = await model('User').findById(authorId);
	if (!author) throw new NotFoundError('User not found');

	const category = await model('Category').findById(categoryId);
	if (!category) throw new NotFoundError('Category not found');

	const post = new this({
		rutrackerId,
		rutrackerURL,
		title,
		description,
		publishDate,
		magnetURL,
		downloadTorrentURL,
		thanksList,
		authorId: author.id,
		categoryId: category.id
	});

	return post.save();
};

module.exports = model('Post', postSchema);
