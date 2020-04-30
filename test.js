const { spawn } = require('child_process');
const request = require('request');
const test = require('tape');
const fs = require('fs');

const PORT = 5000;

// read hidden tokens as json
const tokens = JSON.parse(fs.readFileSync('tokens.json'));

// Start the app

// add default port of 5000 to environment
let env = Object.assign({}, process.env, { PORT: PORT });

// add hidden tokens to tthe environment
env = Object.assign({}, env, tokens);

// spawn the server with custom environment
const child = spawn('node', ['index.js'], { env });

test('responds to requests', (t) => {
	t.plan(2);

	// Wait until the server is ready
	child.stdout.on('data', _ => {

		const options = {
			uri: 'http://127.0.0.1:5000',
			method: 'POST',
			json: {
				"attachments": [],
				"avatar_url": "https://i.groupme.com/123456789",
				"created_at": 1302623328,
				"group_id": "1234567890",
				"id": "1234567890",
				"name": "John",
				"sender_id": "12345",
				"sender_type": "user",
				"source_guid": "GUID",
				"system": false,
				"text": "/joey",
				"user_id": "1234567890"  
			}
		};

		request(options, (error, res, body) => {

				// stop the server
				child.kill();
				
				// No error
				t.false(error);
				// Successful response
				t.equal(res.statusCode, 200);
			}
		)
	});
});
