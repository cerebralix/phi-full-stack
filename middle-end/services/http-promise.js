
/*
 * Promise Http Request
 */

var Q = require('q'),
	backend = require('../../config/backend');

var init = function () {

	'use strict';

	return {

		query: function(path) {

			var http = require('q-io/http'),
				options = backend;

			options.path = path + '.json';

			return http.request(options).
					then(function (response) {
						var data;

						response.body.forEach(function (chunk) {
							data = chunk;
						});

						return Q.fcall(function() {
							return data;
						});
					},
					function (error) {
						console.log(error);
					});
		}
	};
};

module.exports = init();