#!/usr/bin/env node

function main() {
    for (let i = 2; i < process.argv.length; i++) {
        let fname = process.argv[i];
        console.log("");
        console.log(fname, ":");
        let tests = require("./" + fname);
        for (let key of Object.keys(tests)) {
            if (key.startsWith("assert")) continue;
            console.log(key);
            tests[key]();
        }
    }
}

main();