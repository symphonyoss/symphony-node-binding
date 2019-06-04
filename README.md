# symphony-api
A node.js symphony api implementation

# Installation
To use the library, run this command in your project's root path.

```
npm -install symphony-api --save
```

# Getting Started

## Example

```javascript
var symphonyApi = require('symphony-api');
var fs = require('fs');

var urls = {
	keyUrl: 'https://foundation-dev-api.symphony.com/keyauth',
	sessionUrl: 'https://foundation-dev-api.symphony.com/sessionauth',
	agentUrl: 'https://foundation-dev.symphony.com/agent',
	podUrl: 'https://foundation-dev.symphony.com/pod'
};


var cert = fs.readFileSync('./certs/bot-cert.pem', {encoding: 'utf-8'});
var key = fs.readFileSync('./certs/bot-key.pem', {encoding: 'utf-8'}),
var passphrase = 'this is my passphrase'

var api = symphonyApi.create(urls);
api.setCerts(cert, key, passphrase)
api.authenticate()
	.then()
	{
		api.stream.list()
			.then(function(streams)
			{
				if (streams.length > 0) api.message.send(streams[0].id, 'text', 'hello there');
			});
	});
```

# Using the API

The api is encapsulated into a single object that is created using `symphonyApi.create();`. Once
authenticated, additional functionality is made available through members of this main object. For instance,
`api.message.send(streamId, 'text', 'hello world')` will send the text 'hello world' to the stream streamId.


## Api

## api.user (UserModel)
## api.feed (FeedModel)
## api.message (MessageModel)
## api.stream (StreamModel)

## Contributing

1. Fork it (<https://github.com/symphonyoss/symphony-node-binding/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Read our [contribution guidelines](.github/CONTRIBUTING.md) and [Community Code of Conduct](https://www.finos.org/code-of-conduct)
4. Commit your changes (`git commit -am 'Add some fooBar'`)
5. Push to the branch (`git push origin feature/fooBar`)
6. Create a new Pull Request

## License

The code in this repository is distributed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

Copyright 2017-2019 Symphony LLC