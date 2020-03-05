let config = require("../config.json")

function set_config(_config) {
	config = _config;
	return true;
}

function get_config() {
	return config;
}

module.exports = {
	set_config,
	get_config,
	gc: get_config
}