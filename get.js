const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const request = require('request');

app.get('/', (req, res) => {
	res.send("data");	
});

app.listen('3600');