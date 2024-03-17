const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	rutrackerId: { type: String },
	rutrackerURL: { type: String },
	username: { type: String }
});

userSchema.statics.getOrCreate = async function (userData) {
	const { username, rutrackerId, rutrackerURL } = userData;

	const user = await this.findOne({ rutrackerId });
	if (!user) {
		return this.create({
			username: username,
			rutrackerId: rutrackerId,
			rutrackerURL: rutrackerURL
		});
	} else return user;
};

module.exports = model('User', userSchema);
