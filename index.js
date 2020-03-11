//wow - 2020
//index.js

const data = require("./app/retrieve_data");
const embed = require("./app/embed");
let config = require("./app/config.js");

/** Automatically pushes data to webhook as a discord embeds
 * @return {boolean}
 */

/**
 * Automatically finds and posts information to provided Webhooks.
 * @return {Promise}
 */
async function post_data(do_a_test = false) {
	return new Promise(function (resolve, reject) {
		data.create_latest_embed().then(function (latest_embed) {
			if (!do_a_test) {
				embed.post_embeds(latest_embed).then(function (res) {
					resolve(true);
				}).catch(function (err) {
					reject(err)
				})
			}
			resolve(latest_embed);
		}).catch(function (err) {
			reject(err);
		})
	})
}

if (require.main === module) { // node index.js
	console.log("Loading scheduler")
	let schedule = undefined;
	try {
		schedule = require("node-schedule");
	} catch {
		throw "Requirements: node-schedule, This module is not needed as an imported module.";
	}
	let rule = new schedule.RecurrenceRule();
	rule.hour = config.gc().time.hour;
	rule.minute = config.gc().time.minute;
	let job = schedule.scheduleJob(rule, function () {
		post_data().then(function () {
			console.info("Successfully posted data.")
		}).catch(console.error);
	})
	console.log(`Loaded at ${rule.hour}:${rule.minute}.`);

} else { // When index.js is "required"
	module.exports = {
		data,
		embed,
		post_data,
		set_config: config.set_config,
	}
}