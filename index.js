var Api = require('./lib/Api');
exports.AuthModel = require('./lib/AuthModel');
exports.FeedModel = require('./lib/FeedModel');
exports.MessageModel = require('./lib/MessageModel');

exports.create = function(urls)
{
	return new Api(urls);
}
