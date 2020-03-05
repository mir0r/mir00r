//wow - 2020
//https_requests.js

/**
 * @async
 * @param {string} url
 * @return {promise} data
 */
function get(url) {
	return new Promise(function (resolve, reject) {
		let protocol = (url[4] === "s") ? "https" : "http";

		const lib = require(protocol);
		let data = "";
		lib.get(url, function (res) {
			if (res.statusCode !== 200) {
				reject({descriptor: "statusCode", error: res.statusCode})
				return;
			}

			res.on('data', function (d) {
				data += d;
			})
			res.on('end', function () {
				resolve(data);
			})
		}).on('error', function (error) {
			reject({descriptor: "internet", error: error});
		})
	});
}

/**
 * @async
 * @param {string} url
 * @param {object} postData
 */
function post(url, postData) {
	return new Promise(function (resolve, reject) {
		postData = JSON.stringify(postData);
		let protocol = (url[4] === "s") ? "https" : "http";
		const lib = require(protocol);
		let data = Buffer.alloc(0);
		const options = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'}
		};
		let req = lib.request(url, options, function (res) {
			if (res.statusCode.toString()[0] !== "2") {
				reject({descriptor: "statusCode", error: res.statusCode})
				return;
			}
			res.on('data', function (d) {
				data = Buffer.concat([data, d]);
			})
			res.on('end', function () {
				console.log("Pushed")
				resolve(data);
			})
		}).on('error', function (error) {
			console.error("Error when pushing", error)
			reject({descriptor: "internet", error: error});
		})
		console.log(postData);
		req.write(postData);
		req.end();
	});
}

module.exports = {
	get,
	post
}