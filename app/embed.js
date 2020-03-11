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
		latest: {world: {Confirmed: 0, Deaths: 0, Recovered: 0}},
		yesterday: {world: {Confirmed: 0, Deaths: 0, Recovered: 0}},
	};

	nCov_data["latest"] = populate(nCov_data["latest"], data);
	nCov_data["yesterday"] = populate(nCov_data["yesterday"], previous_data);

	return create_fields(config.gc().Calculation, nCov_data, embed);
}

function create_fields(method, nCov_data, embed) {
	let today_existing;
	let yesterday_existing;
	switch (method) {
		case "Existing":
			today_existing = {
				country: (parseInt(nCov_data["latest"][config.gc().country]["Confirmed"])
					- parseInt(nCov_data["latest"][config.gc().country]["Deaths"])
					- parseInt(nCov_data["latest"][config.gc().country]["Recovered"])),
				world: (parseInt(nCov_data["latest"]["world"]["Confirmed"])
					- parseInt(nCov_data["latest"]["world"]["Deaths"])
					- parseInt(nCov_data["latest"]["world"]["Recovered"]))
			}
			yesterday_existing = { //TODO: fix copy pasting.
				country: (parseInt(nCov_data["yesterday"][config.gc().country]["Confirmed"])
					- parseInt(nCov_data["yesterday"][config.gc().country]["Deaths"])
					- parseInt(nCov_data["yesterday"][config.gc().country]["Recovered"])),
				world: (parseInt(nCov_data["yesterday"]["world"]["Confirmed"])
					- parseInt(nCov_data["yesterday"]["world"]["Deaths"])
					- parseInt(nCov_data["yesterday"]["world"]["Recovered"]))
			}
			break;
		case "Confirmed":
			today_existing = {
				country: (parseInt(nCov_data["latest"][config.gc().country]["Confirmed"])),
				world: (parseInt(nCov_data["latest"]["world"]["Confirmed"]))
			}
			yesterday_existing = { //TODO: fix copy pasting.
				country: (parseInt(nCov_data["yesterday"][config.gc().country]["Confirmed"])),
				world: (parseInt(nCov_data["yesterday"]["word"]["Confirmed"]))
			}
			break;
		default:
			throw "This method of calculation isn't supported."
	}

	embed.embeds[0]["fields"][0].value = today_existing.country + " " + config.gc().suffix; //Country total
	embed.embeds[0]["fields"][1].value = today_existing.world + " " + config.gc().suffix; // World Total

	let stats = {
		new_country: today_existing.country - yesterday_existing.country,
		new_world: today_existing.world - yesterday_existing.world
	}

	stats["percent_country"] = Math.floor((stats.new_country / yesterday_existing.country) * 100) // Country Percent
	stats["percent_world"] = Math.floor((stats.new_world / yesterday_existing.world) * 100) // World Percent
	console.log(stats.percent_world)
	console.log(stats.percent_country)

	stats["symbol_country"] = stats.percent_country < 0 ? "" : "+"
	stats["symbol_world"] = stats.percent_world < 0 ? "" : "+"

	embed.embeds[0]["fields"][2].value = `${stats.symbol_country}${stats.new_country} ${config.gc().suffix} (${stats.symbol_country}${stats.percent_country}%)`;
	embed.embeds[0]["fields"][3].value = `${stats.symbol_world}${stats.new_world} ${config.gc().suffix} (${stats.symbol_world}${stats.percent_world}%)`;
	embed.embeds[0]["fields"][4].value = Object.keys(nCov_data.latest).length;
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
		for (let i2 = 0; i2 < to_copy.length; i2++) {
			if (!isNaN(parseInt(data[i][to_copy[i2]]))) {
				nCov_data.world[to_copy[i2]] += parseInt(data[i][to_copy[i2]]);
			}
		}
	}
	return nCov_data;
}

module.exports = {
	embed_news,
	post_embeds,
	config
}