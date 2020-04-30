const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const PORT = parseInt(process.env.PORT) || 5000
const BOT_ID = process.env.BOT_ID
const ROOM_ID = process.env.ROOM_ID
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

if (!BOT_ID) {
	console.log("Missing BOT_ID environment variable.");
}
if (!ROOM_ID) {
	console.log("Missing ROOM_ID environment variable.");
}
if (!ACCESS_TOKEN) {
	console.log("Missing ACCESS_TOKEN environment variable.");
}
if (!BOT_ID || !ROOM_ID || !ACCESS_TOKEN) {
	process.exit(1);
}

// main express server
const app = express();
app.use(bodyParser.json())
app.post('/', (req, res) => handle(req, res));
app.listen(PORT, () => console.log(`Listening on ${PORT}`))

const command = "/joey";

handle = (req, res) => {

	if (!req.body || !req.body.text) {
		res.status(400).json({body: false});
		return;
	}

	if (req.body.text.substr(0, command.length).toLowerCase() !== command) {
		res.status(200).json({status:"ok"})
		return;
	}

	// Send the request
	const text = "Hello world";
	const message = {
		bot_id: BOT_ID,
		text: text
	};

	const options = {
		uri: 'https://api.groupme.com:443/v3/bots/post',
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		json: message
	};

	request(options, (error, res, body) => {
		console.log(error);
	});

	res.status(200).json({status:"ok"})
}