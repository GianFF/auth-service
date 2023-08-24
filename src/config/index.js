require('dotenv').config();

module.exports = {
  DB_URL: process.env.DB_URL,
  EMAIL_FROM: process.env.EMAIL_FROM,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  awsConfig: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
};
