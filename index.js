const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')

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

	const text = "";
	const message = {
		text,
		BOT_ID,
		attachments: [
			{
				"type": "image",
				"url": "https://i.groupme.com/somethingsomething.large"
			}
		]
	};

	// Send the request
	const json = JSON.stringify(message);
	const groupmeAPIOptions = {
		agent: false,
		host: "api.groupme.com",
		path: "/v3/bots/post",
		port: 443,
		method: "POST",
		headers: {
			"Content-Length": json.length,
			"Content-Type": "application/json",
			"X-Access-Token": ACCESS_TOKEN
		}
	};
	const request = https.request(groupmeAPIOptions, response => {
		let data = "";
		response.on("data", chunk => (data += chunk));
		response.on("end", () =>
			console.log(`[GROUPME RESPONSE] ${response.statusCode} ${data}`)
		);
	});
	request.end(json);

	res.status(200).json({status:"ok"})
}