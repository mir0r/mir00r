//wow - 2020
//csv.js

/** toJson()
 @param {string} csv_text
 @return {object} result
 */
function toObject(csv_text) {
	//csv_text = csv_text.trim();

	let lines = csv_text.split(/\r?\n/);
	let header = deconstruct_lines(lines[0]);
	let res = [];

	for (let i = 1; i < lines.length; i++) {
		let line_res = {}
		let args = deconstruct_lines(lines[i]);
		for (let i2 = 0; i2 < args.length; i2++) {
			line_res[header[i2]] = args[i2];
		}
		res.push(line_res);
	}

	return res;
}

/** deconstruct_lines()
 * @param {string} line
 * @param {string} [separator=,]
 */
function deconstruct_lines(line, separator = ",") {
	let args = line.split(separator);
	let quote = {active: false, size: 0};
	let i = 0;
	while (i < args.length) { //Quote support
		quote.active = args[i].includes('"')
		if (quote.active) {
			quote.size++;
			if (args[i].includes('"') && quote.size > 1) {
				args = merge(args, i + 1 - quote.size, i, separator);
				quote.active = false;
				quote.size = 0;
			}
		}
		i++;
	}

	for (let i = 0; i < args.length; i++) { // Cleaning dual quotes
		if (args[i][0] === '"' && args[i][args[i].length - 1] === '"') {
			args[i] = args[i].slice(1, args[i].length - 1)
		}
	}

	return args;
}

/** merge()
 * @param {array} arr
 * @param {number} starts
 * @param {number} to
 * @param {string} [add_char=]
 */
function merge(arr, starts, to, add_char = "") {
	if (starts > to)
		throw "from > to"
	let size = to - starts;

	for (let i = starts + 1; i <= to; i++) {
		arr[starts] += add_char + arr[i];
	}
	arr.splice(starts + 1, size);
	return arr;
}

/** Counts characters in a string
 * @param {string} str
 * @param {string} char
 */
function count(str, char) {
	let count = 0;
	for (let i = 0; i < str.length; i++) {
		if (str[i] === char)
			count++;
	}
	return count;
}

module.exports = {
	toObject
}