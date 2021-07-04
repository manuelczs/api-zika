import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  apiKeyGoogle: process.env.API_KEY,
  email: process.env.EMAIL,
  emailService: process.env.EMAIL_SERVICE,
  emailPassword: process.env.EMAIL_PASSWORD,
}

module.exports = config;