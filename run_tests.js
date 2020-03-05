// wow - 2020
//run_tests.js

let valids = {
	total: 0,
	passed: 0,
	fatal: 0
}
//Check presence of node-schedule
try {
	require("node-schedule")
	console.log("[+] node-schedule installed.")
	valids.total++;
	valids.passed++;
} catch {
	console.info("[/] node-schedule not installed")
	valids.total++;
}

//Check config file
try {
	require("./config.json")
	console.log("[+] Valid config file.")
	valids.total++;
	valids.passed++;
} catch (e) {
	console.error("[-] Invalid config file.", e)
	valids.total++;
	valids.fatal++;
}

//Check main file
try {
	require("./index.js");
	console.log("[+] No error on index.js")
	valids.total++;
	valids.passed++;
} catch (e) {
	console.error("[-] index.js isn't valid.", e)
	valids.total++;
	valids.fatal++;
}

console.log(`\nPassed ${valids.passed}/${valids.total} tests.`)
if (valids.fatal > 0) {
	throw(`${valids.fatal} fatal error !`);
}

return 0;