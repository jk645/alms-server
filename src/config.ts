const development = process.env.NODE_ENV.trim() === 'development';
// Goal with QA environment is to be as close to production configuration as possible,
// but using different data.  Only differnce from production configuration should be
// to use a different corsWhitelistProd so that a different front end client can
// access it.  The different DB details are stored on the server in environment
// properties.
const qa = process.env.NODE_ENV.trim() === 'qa';

export const CONFIG = {
  uiHostedUrl: (development) ? 'http://localhost:4200' : process.env.UI_HOSTED_URL.trim(),
  corsWhitelistProd: (qa)
    ? [
      'http://localhost:4200',
      'http://app-qa-completeyur-work.s3-website-us-east-1.amazonaws.com',
      'https://d375fxipzkbwom.cloudfront.net',
      'https://app-qa1212.completeyur.work'
    ]
    : [
      'http://app-completeyur-work.s3-website-us-east-1.amazonaws.com',
      'https://d2b5jhs0c56ept.cloudfront.net',
      'https://app.completeyur.work'
    ],
  dbConnection: [
    'mongodb://',
    (development) ? 'actus-dev-server' : process.env.DB_USER.trim(),
    ':',
    (development) ? 'ISM47WovG21DQxRY' : process.env.DB_PASSWORD.trim(),
    '@',
    // TODO: once have separate cluster for prod, use this as default, but replace with process.env.DB_HOST if process.env.NODE_ENV === 'production'
    'actuscluster0-shard-00-00-sg1dr.mongodb.net:27017,actuscluster0-shard-00-01-sg1dr.mongodb.net:27017,actuscluster0-shard-00-02-sg1dr.mongodb.net:27017',
    '/',
    (development) ? 'actus-dev' : process.env.DB_NAME.trim(),
    '?ssl=true&replicaSet=ActusCluster0-shard-0&authSource=admin'
  ].join(''),
  secretKey: (development)
    ? 'YdXaX6iQnyqOWRJ6qWem3dL56mzdVa6YyptwTLfKwEIw1psFUGsWeYs8x9ZenZe'
    : process.env.SECRET_KEY.trim(),  // Make prod secretKey much longer
  tokenTTL: 3600,  // 1 hour
  refreshTokenAdditionalTTL: 3600,  // 1 hour
  randomStringChars: (development)
    ? 'bFzxHOJwElfciqQ25tAOvg7SkPTkVF0VeDwJTZosJTft5Wke6XPJDTIynAYliEz'
    : process.env.RANDOM_STRING_CHARS.trim(),  // Make prod randomStringChars longer
  randomStringCharsNumbersOnly: '0123456789',
  userInviteCode: '92563',  // Temp during beta testing, something arbitrary but easy to remember
  userNameMaxLength: 50,
  userEmailMaxLength: 50,
  userPasswordMaxLength: 100,
  userPasswordMinLength: 10,
  userPasswordComplexityPatterns: {
    letterLowercase: /[a-z]/,
    letterUppercase: /[A-Z]/,
    digit: /[0-9]/,
    symbol: /\W/ // non-word character
  },
};
