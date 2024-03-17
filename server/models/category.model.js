const { model, Schema, Types } = require('mongoose');
const { NotFoundError } = require('../utils/errors.util');

const categorySchema = new Schema({
	rutrackerId: { type: String },
	rutrackerURL: { type: String },

	name: { type: String },
	type: { type: String, default: 'category' },

	parentId: { type: Types.ObjectId, ref: 'Category' }
});

categorySchema.statics.getCategories = async function (findQuery, page = 1, step = 15) {
	if (typeof page !== 'number') page = +page;
	if (typeof step !== 'number') step = +step;

	const result = await this.aggregate([
		{
			$match: findQuery
		},
		{ $skip: (page - 1) * step },
		{ $limit: step }
	]);

	return result;
};

categorySchema.statics.getOrCreate = async function (categoryData) {
	const {
		name,
		rutrackerId, // rutrackerID категории
		rutrackerURL,
		type,
		parentId // rutrackerID родительской категории
	} = categoryData;

	const isExist = await this.findOne({ rutrackerId, type });
	if (!isExist) {
		const subcategory = new this({
			rutrackerId: rutrackerId,
			rutrackerURL: rutrackerURL,
			name: name,
			type: type
		});

		if (parentId) {
			const parent = await model('Category').findOne({
				rutrackerId: parentId,
				type: 'category'
			});
			if (!parent) throw new NotFoundError('Parent Category not found');

			subcategory.parentId = parent.id; // mongoId родительской категории
		}

		return subcategory.save();
	} else return isExist;
};

module.exports = model('Category', categorySchema);
