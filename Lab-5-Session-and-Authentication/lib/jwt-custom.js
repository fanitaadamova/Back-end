const jwt = require('jsonwebtoken');

const sign = (payloads, secret, options) => {
    const promise = new Promise((resolve, reject) => {
        jwt.sign(payloads, secret, options, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });

    return promise;
}

const verify = (token, secret) => {
    const promise = new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });

    return promise;
}

const jwtPromises = {
    sign,
    verify
}

module.exports = jwtPromises;