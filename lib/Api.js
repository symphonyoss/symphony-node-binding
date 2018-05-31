const certs = require('./cert');
const AuthModel = require('./AuthModel');
const MessageModel = require('./MessageModel');
const FeedModel = require('./FeedModel');
const UserModel = require('./UserModel');
const StreamModel = require('./StreamModel');
const RoomModel = require('./RoomModel');
const SignalModel = require('./SignalModel');
const ConnectionModel = require('./ConnectionModel');

class Api {
	constructor(urls)
	{
		if (!urls) throw (new Error('missing urls'));
		if (!urls.keyUrl) throw (new Error('missing key store url (urls.keyUrl)'));
		if (!urls.sessionUrl) throw (new Error('missing session url (urls.sessionUrl)'));
		if (!urls.agentUrl) throw (new Error('missing agent url (urls.agentUrl)'));
		if (!urls.podUrl) throw (new Error('missing pod url (urls.podUrl)'));

		this.urls = urls;
		this.log = true;
	}

	setCerts(certPem, keyPem, passphrase)
	{
		var chain = certs.extractCerts(certPem);
		var cert = chain.pop();

		var sslOptions = {
			cert: cert,
			key: keyPem,
			passphrase: passphrase,
			requestCert: false,
			ca: chain,
		};

		this.sslOptions = sslOptions;
	}

	setRsa(privateKey, publicKey, userName)
	{
		this.rsaOptions = {
			privateKey: privateKey,
			publicKey: publicKey,
			userName: userName
		};
	}

	setSslOptions(sslOptions)
	{
		this.sslOptions = sslOptions
	}

	checkAuth()
	{
		if (!this.sslOptions && !this.rsaOptions) throw (new Error('authenticationb have not been configured, please call setCerts or setSllOptions or setRsaOptions'));
	}

	setLogState(on)
	{
		this.log = on;

		if (this.feed) this.feed.setLogState(this.log);
		if (this.message) this.message.setLogState(this.log);
		if (this.user) this.user.setLogState(this.log);
		if (this.stream) this.stream.setLogState(this.log);
		if (this.room) this.room.setLogState(this.log);
		if (this.signal) this.signal.setLogState(this.log);
		if (this.connection) this.connection.setLogState(this.log);
	}

	authenticate()
	{
		this.checkAuth();

		var auth = new AuthModel(this.urls, this.sslOptions, this.rsaOptions);
		auth.setLogState(this.log);

		return auth.authenticate()
			.then(function(headers)
			{
				this.headers = headers;
				this.feed = new FeedModel(this.urls.agentUrl, this.sslOptions, this.headers);
				this.message = new MessageModel(this.urls.agentUrl, this.sslOptions, this.headers);
				this.user = new UserModel(this.urls.podUrl, this.sslOptions, this.headers);
				this.stream = new StreamModel(this.urls.podUrl, this.sslOptions, this.headers);
				this.room = new RoomModel(this.urls.podUrl, this.sslOptions, this.headers);
				this.signal = new SignalModel(this.urls.agentUrl, this.sslOptions, this.headers);
				this.connection = new ConnectionModel(this.urls.podUrl, this.sslOptions, this.headers);

				this.feed.setLogState(this.log);
				this.message.setLogState(this.log);
				this.user.setLogState(this.log);
				this.stream.setLogState(this.log);
				this.room.setLogState(this.log);
				this.signal.setLogState(this.log);
				this.connection.setLogState(this.log);

				return headers;
			}.bind(this));
	}

	appAuthenticate()
	{
		this.checkAuth();

		var auth = new AuthModel(this.urls.sessionUrl, this.urls.keyUrl, this.sslOptions);
		auth.setLogState(this.log);

		return auth.appAuthenticate()
			.then(function(headers)
			{
				this.headers = headers;

				return headers;
			}.bind(this));
	}

	extensionAppAuthenticate(userIdAsAppToken)
	{
		this.checkAuth();

		var auth = new AuthModel(this.urls.sessionUrl, this.urls.keyUrl, this.sslOptions);
		auth.setLogState(this.log);

		return auth.extensionAppAuthenticate(userIdAsAppToken)
			.then(function (headers)
			{
				this.headers = headers;

				return headers;
			}.bind(this));
	}

	getPublicCert()
	{
		this.checkAuth();

		var auth = new AuthModel(this.urls.sessionUrl, this.urls.keyUrl, this.sslOptions);
		auth.setLogState(this.log);

		return auth.getPublicCert()
			.then(function(headers)
			{
				this.headers = headers;

				return headers;
			}.bind(this));
	}

	oboAuthenticate(appSessionToken, userId)
	{
		this.checkAuth();

		var auth = new AuthModel(this.urls.sessionUrl, this.urls.keyUrl, this.sslOptions);
		auth.setLogState(this.log);

		return auth.oboAuthenticate(appSessionToken, userId)
			.then(function(headers)
			{
				this.headers = headers;

				return headers;
			}.bind(this));
	}
}

module.exports = Api;
