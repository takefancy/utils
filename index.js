'use strict';
const glob = require('glob'),
	generate = require('nanoid');

let isArray = (e) => {
		return e && e.constructor === Array;
	},
	isString = (e) => {
		return typeof e === 'string';
	},
	union = (x, y) => {
		var obj = {};
		for (var i = x.length - 1; i >= 0; --i)
			obj[x[i]] = x[i];
		for (var i = y.length - 1; i >= 0; --i)
			obj[y[i]] = y[i];
		var res = []
		for (var k in obj) {
			if (obj.hasOwnProperty(k)) // <-- optional
				res.push(obj[k]);
		}
		return res;
	}

function match(patterns, excludes) {
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
	var output = [];
	if (isArray(patterns)) {
		patterns.forEach((e) => {
			output = union(output, match(e, excludes));
		});
	} else if (isString(patterns)) {
		if (urlRegex.test(patterns)) {
			output.push(patterns);
		} else {
			var files = glob.sync(patterns);
			if (excludes) {
				files = files.map((file) => {
					if (isArray(excludes)) {
						for (var i in excludes) {
							file = file.replace(excludes[i], '');
						}
					} else {
						file = file.replace(excludes, '');
					}
					return file;
				});
			}
			output = union(output, files);
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