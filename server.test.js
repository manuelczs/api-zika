var fs = require('fs');

const provinces = require('./server.js');

var jsonData = JSON.parse(fs.readFileSync('./json/final-json.in', 'utf8'));

test('Get provinces', () => {
	expect(provinces.toBe('Jujuy'))
})