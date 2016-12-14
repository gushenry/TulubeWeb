// config/database.js

var username = process.env.TULUBE_DB_USERNAME
var password = process.env.TULUBE_DB_PASSWORD

var databaseUrl = 'mongodb://'+username+':'+password+'@ds031607.mlab.com:31607/tulube';

module.exports = {

    'url' : databaseUrl // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

};