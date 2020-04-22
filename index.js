'use strict';
const glob = require('glob'),
	generate = require('nanoid');

function match(patterns, excludes) {
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
	var output = [];
	if (_.isArray(patterns)) {
		patterns.forEach((e) => {
			output = _.union(output, match(e, excludes));
		});
	} else if (_.isString(patterns)) {
		if (urlRegex.test(patterns)) {
			output.push(patterns);
		} else {
			var files = glob.sync(patterns);
			if (excludes) {
				files = files.map((file) => {
					if (_.isArray(excludes)) {
						for (var i in excludes) {
							file = file.replace(excludes[i], '');
						}
					} else {
						file = file.replace(excludes, '');
					}
					return file;
				});
			}
			output = _.union(output, files);
		}
	}
	return output;
}

let phone = {
	mask: function(e) {
		if (e) {
			let ending = e.slice(e.length - 4);
			return `(***) *** ${ending}`;
		}
		return '';
	}
};
let random = {
	string: (length) => {
		return generate.customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', length || 6)();
	}
};

let color = {
	contrast: (hexcolor) => {
		// If a leading # is provided, remove it
		if (hexcolor.slice(0, 1) === '#') {
			hexcolor = hexcolor.slice(1);
		}
		// If a three-character hexcode, make six-character
		if (hexcolor.length === 3) {
			hexcolor = hexcolor.split('').map(function(hex) {
				return hex + hex;
			}).join('');
		}
		// Convert to RGB value
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);
		// Get YIQ ratio
		var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
		// Check contrast
		return (yiq >= 128) ? 'black' : 'white';

	}
};
module.exports = {
	match: match,
	phone: phone,
	random: random,
	color: color
};