const mongoose = require('mongoose');

const { dbHost, dbPort, dbName } = require('./server.config');

const models = require('./server/models');

module.exports = mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`);
