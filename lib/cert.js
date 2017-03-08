exports.extractCerts = function(certs)
{
	var certArray = [];
	var lines;
	var line;
	var current = '';
	var inCert;

	certs = certs.replace(/\r/g, '');
	lines = certs.split('\n');
	inCert = false;
	for (idx = 0; idx < lines.length; idx++)
	{
		line = lines[idx];
		if (!inCert && line.indexOf('-----BEGIN') === 0)
		{
			current += line + '\n'
			inCert = true;
		}
		else if (inCert && line.indexOf('-----END') === 0)
		{
			inCert = false;
			current += line + '\r\n'
			certArray.unshift(current);
			current = '';
		}
		else if (inCert) current += line + '\n';
	}

	return certArray;
}
