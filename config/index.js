import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  apiKeyGoogle: process.env.API_KEY
}

module.exports = config;