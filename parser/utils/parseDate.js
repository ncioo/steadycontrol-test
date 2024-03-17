module.exports = function (dateString) {
	const parts = dateString.split(' ');

	const monthNames = [
		'Янв',
		'Фев',
		'Мар',
		'Апр',
		'Май',
		'Июн',
		'Июл',
		'Авг',
		'Сен',
		'Окт',
		'Ноя',
		'Дек'
	];

	const datePart = parts[0].split('-');

	const day = parseInt(datePart[0]);
	const month = monthNames.indexOf(datePart[1]);
	const year = parseInt(datePart[2]) + 2000;

	if (!parts[1]) return new Date(year, month - 1, day);

	const timePart = parts[1].split(':');
	const hours = parseInt(timePart[0]);
	const minutes = parseInt(timePart[1]);

	return new Date(year, month, day, hours, minutes);
};
