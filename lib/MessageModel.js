var Q = require('q');
var RequestModel = require('./RequestModel');
var urljoin = require('url-join');

class v2 extends RequestModel
{
	constructor (agentBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);
		this.agentBaseUrl = agentBaseUrl;
	}

	send (threadId, format, message)
	{
		var body = {
			format: format.toUpperCase(),
			message: message
		};

		var options = {
			json: true,
			body: body
		};

		return this.request(urljoin(this.agentBaseUrl, '/v2/stream/', threadId, '/message/create'), 'POST', options)
	}
}

class v4 extends RequestModel
{
	constructor (agentBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);
		this.agentBaseUrl = agentBaseUrl;
	}

	send (threadId, message, json, attachment)
	{
		var formData = {
			message: message,
			data: JSON.stringify(json || {})
		};

		if (attachment)
			formData.attachment = attachment;

		var options = {
			formData: formData
		};

		return this.request(urljoin(this.agentBaseUrl, '/v4/stream/', threadId, '/message/create'), 'POST', options)
	}

	read (threadId, since, skip, limit)
	{
		since = since || Math.floor(Date.now());
		skip = skip || 0;
		limit = limit || 50;


		var options = {
			qs: {
  //				since: since,
  				toDate: Date.now(),
				skip: skip,
				limit: limit,
				query: 'streamId:'+threadId,
			}
		};

//		return this.request(urljoin(this.agentBaseUrl, '/v4/stream/', threadId, '/message'), 'GET', options)
		return this.request(urljoin(this.agentBaseUrl, '/v1/message/search'), 'GET', options)
	}
}

class MessageModel extends RequestModel
{
	constructor (agentBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);

		this.agentBaseUrl = agentBaseUrl;
		this.v2 = new v2(agentBaseUrl, certOptions, headers);
        this.v3 = new v2(agentBaseUrl, certOptions, headers);
		this.v4 = new v4(agentBaseUrl, certOptions, headers);
	}

	send (threadId, format, message)
	{
		this.v2.send(threadId, format, message);
	}
}

module.exports = MessageModel;
