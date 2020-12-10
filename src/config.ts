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
      'http://app-stuffsort-com.s3-website-us-west-2.amazonaws.com',
      'https://dthvkc9lvowbf.cloudfront.net',
      'https://app.stuffsort.com'
    ]
    : [
      'http://app-stuffsort-com.s3-website-us-west-2.amazonaws.com',
      'https://dthvkc9lvowbf.cloudfront.net',
      'https://app.stuffsort.com'
    ],
  dbConnection: [
    'mongodb+srv://',
    (development) ? 'alms-server' : process.env.DB_USER.trim(),
    ':',
    (development) ? 'QrxYjKELsRyR9bO5' : process.env.DB_PASSWORD.trim(),
    '@',
    // TODO: once have separate cluster for prod, use this as default, but replace with process.env.DB_HOST if process.env.NODE_ENV === 'production'
    'actuscluster0.sg1dr.mongodb.net',
    '/',
    (development) ? 'alms' : process.env.DB_NAME.trim(),
    '?retryWrites=true&w=majority'
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
  defaultPageSize: 5,
};
