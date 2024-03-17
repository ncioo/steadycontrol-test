class OperationError extends Error {
	constructor(type, message) {
		super(message);
		this.type = type;
		this.message = message;
	}
	toJSON() {
		return { type: this.type, message: this.message };
	}
}

class NotFoundError extends OperationError {
	constructor(message) {
		super('NotFound', message);
	}
}

class IncorrectDataError extends OperationError {
	constructor(message) {
		super('IncorrectData', message);
	}
}

module.exports = { OperationError, NotFoundError, IncorrectDataError };
