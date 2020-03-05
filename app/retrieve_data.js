// wow - 2020
//retrieve_data.js

const csv = require("./csv");
const req = require("./https_requests");
const embed = require("./embed");
let config = require("./config.js")

/**
 * Get data according to the time
 * @async
 * @param time - In any format supported by JS.
 * @return {Promise}
 */
function get_data(time) {
	return new Promise(function (resolve, reject) {
		let date = new Date(time)
		let month = (date.getMonth() < 10 ? "0" : "") + (date.getMonth() + 1);
		let day = (date.getDate() < 10 ? "0" : "") + date.getDate();

		let formatted_time = `${month}-${day}-${date.getFullYear()}`;

		req.get(config.gc().base_url + formatted_time + ".csv").then(function (res) {
			resolve(csv.toObject(res));
		}).catch(function (error) {
			reject(error);
		})
	})
}

/**
 * @async
 * @param {number} [sub_days=1] Number of days to subtract
 * @return {Promise} object
 */
function get_data_since(sub_days = 1) {
	return get_data(new Date().setDate(new Date().getDate() - sub_days));
}

/**
 * @async
 * @return {Promise} embed
 */
function create_latest_embed() {
	return new Promise(function (resolve, reject) {
		get_data_since().then(function (today) {
			get_data_since(2).then(function (yesterday) {
				resolve(embed.embed_news(today, yesterday));
			}).catch(function (error) {
				reject(error)
			})
		}).catch(function (error) {
			reject(error)
		})
	})
}

module.exports = {
	get_data,
	get_data_since,
	create_latest_embed,
}