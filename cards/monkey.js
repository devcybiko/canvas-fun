let log=console.log;

function first(s) {
	log("first", s);
	log(new Error(s));
}

first("hello");
log(Object.getPrototypeOf(first));
