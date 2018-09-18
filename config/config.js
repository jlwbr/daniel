require('dotenv').config();

module.exports = {
	token: process.env.TOKEN,
	google_api_key: process.env.GOOGLE_API_KEY,
	prefix: '!',
	servers: {},
};