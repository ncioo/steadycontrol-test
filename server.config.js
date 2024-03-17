require('dotenv').config({ path: __dirname + `/.env` });

module.exports = {
	dbHost: process.env.DB_HOST,
	dbPort: process.env.DB_PORT,
	dbName: process.env.DB_NAME,
	serverPort: process.env.SERVER_PORT,
	APIKey: 'very-secret-api-key'
};
