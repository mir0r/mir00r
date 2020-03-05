//wow - 2020
//embed.js

let config = require("./config.js")
const requests = require("./https_requests");

/**
 * @param {object} embed
 * @param {array} [webhooks=config.gc().webhooks]
 */
function post_embeds(embed, webhooks = config.gc().webhooks) {
	return new Promise(function (resolve, reject) {
		webhooks.forEach(function (webhook) {
			requests.post(webhook, embed).then(function () {
				resolve(true);
			})
			.catch(function (error) {
				reject({status: false, description: "Web", error: error})
			})
		})
	})
}

/**
 * @param {object} data
 * @param {object} previous_data
 * @return {object} embed
 */
function embed_news(data, previous_data) {
	let embed = JSON.parse(JSON.stringify(config.gc().template)); //Used to "deep copy" the table.

	let nCov_data = {
		latest: {world: 0},
		yesterday: {world: 0},
	};

	nCov_data["latest"] = populate(nCov_data["latest"], data);
	nCov_data["yesterday"] = populate(nCov_data["yesterday"], previous_data);
	embed.embeds[0]["fields"][0].value = nCov_data["latest"][config.gc().country]["Confirmed"] + " " + config.gc().suffix;
	embed.embeds[0]["fields"][1].value = nCov_data["latest"]["world"] + " " + config.gc().suffix;
	let stats = {
		new_country: parseInt(nCov_data["latest"][config.gc().country]["Confirmed"]) - parseInt(nCov_data["yesterday"][config.gc().country]["Confirmed"]),
		new_world: parseInt(nCov_data["latest"]["world"]) - parseInt(nCov_data["yesterday"]["world"]),
	}
	stats["percent_country"] = (stats.new_country / nCov_data["yesterday"][config.gc().country]["Confirmed"]) * 100
	stats["percent_world"] = (stats.new_world / nCov_data["yesterday"]["world"]) * 100

	embed.embeds[0]["fields"][2].value = `+${stats.new_country} ${config.gc().suffix} (+${Math.floor(stats["percent_country"])}%)`;
	embed.embeds[0]["fields"][3].value = `+${stats.new_world} ${config.gc().suffix} (+${Math.floor(stats["percent_world"])}%)`;
	return embed;
}

/**
 * @param {object} _nCov_data
 * @param {Object} data
 * @return {object} nCov_data
 */
function populate(_nCov_data, data) {
	let nCov_data = JSON.parse(JSON.stringify(_nCov_data)); //Used to "deep copy" the table.
	const to_copy = ["Confirmed", "Deaths", "Recovered"];
	for (let i = 0; i < data.length; i++) {
		if (nCov_data[data[i]["Country/Region"]] !== undefined) {
			to_copy.forEach(function (value) {
					nCov_data[data[i]["Country/Region"]][value] = (parseInt(nCov_data[data[i]["Country/Region"]][value]) + parseInt(data[i][value])).toString();
				}
			)
		} else {
			nCov_data[data[i]["Country/Region"]] = data[i];
		}
		if (!isNaN(parseInt(data[i]["Confirmed"]))) {
			nCov_data.world += parseInt(data[i]["Confirmed"]);
		}
	}
	return nCov_data;
}

module.exports = {
	embed_news,
	post_embeds,
	config
}