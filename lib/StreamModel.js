var Q = require('q');
var RequestModel = require('./RequestModel');
var urljoin = require('url-join');

class StreamModel extends RequestModel {
	constructor (podBaseUrl, certOptions, headers)
	{
		super(certOptions, headers);
		this.podBaseUrl = podBaseUrl;
	}

	list (start = 0, count = 100, streamTypes, includeInactive)
	{
		var qs = {
			skip : start,
			limit: count
		};

		var body = {
			streamTypes: streamTypes,
			includeInactiveStreams: Boolean(includeInactive)
		}

		return this.request(urljoin(this.podBaseUrl, '/v1/streams/list'), 'POST', {qs : params, body: JSON.stringify(body)});
	}

	oneInfo (id)
	{
		return this.request(urljoin(this.podBaseUrl, '/v1/streams', id, 'info'), 'GET');
	}

	info (ids)
	{
		var promises = [];
		if (!Array.isArray(ids)) ids = [ids];

		ids.forEach(function(id)
		{
			promises.push(oneInfo(id));
		}, this)

		return Q.allSettled(promises)
			.then(function(responses)
			{
				var results = [];

				responses.forEach(function(response)
				{
					if (response.value) results.push(response.value);
				}, this);

				return results;
			}.bind(this));
	}
}

module.exports = StreamModel;
