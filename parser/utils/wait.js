module.exports = async function (duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
};
