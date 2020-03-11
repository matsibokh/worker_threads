const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const { Worker } = require('worker_threads');
require('events').EventEmitter.defaultMaxListeners = 1000;
process.setMaxListeners(0);
app.post('/', jsonParser, (req, res) => {
	const body = req.body;
	const data = [];
	const length = body.count;
	for(let i = 0; i < length; i++) {
	    data.push(body.url);
	}

	const worker = new Worker('./worker.js', {workerData:data});
	worker.on('message', (msg) => {
	  console.log('Worker message:', msg);
	  res.end(msg);
	});
});

app.listen('3500');