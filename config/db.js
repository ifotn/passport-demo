// set up db conn string
module.exports = {
    'url': 'mongodb://localhost/passport',
    'githubClientID': 'ff02279f3b5ed3129c68',
    'clientSecret': 'cad6757aed447e00e6bf83bf326ac2219054d8b5',
    'callbackURL': 'http://localhost:3000/auth/github/callback',
    'ids': {
        'github': {
            'clientID': 'ff02279f3b5ed3129c68',
            'clientSecret': 'cad6757aed447e00e6bf83bf326ac2219054d8b5',
            'callbackURL': 'http://localhost:3000/auth/github/callback'
        }
    }
};
