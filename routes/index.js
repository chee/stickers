/*
 * GET home page.
 */
var fs = require('fs');
exports.index = function(req, res) {
	fs.readFile('data/icons.json', function (up, buffer) {
		if (up) throw up;
		try {
			var stickers = JSON.parse(buffer.toString());
			res.render('index', { stickers: stickers});
		} catch (tantrum) {
			throw tantrum;
		}
	});
};
