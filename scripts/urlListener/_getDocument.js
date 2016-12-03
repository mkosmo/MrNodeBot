'use strict';

const _ = require('lodash');
const rp = require('request-promise-native');
const xray = require('x-ray')();
const helpers = require('../../helpers');
const logger = require('../../lib/logger');

module.exports = results => new Promise((resolve, reject) => rp({
        uri: results.url,
        resolveWithFullResponse: true,
        headers: {
            // Fake user agent so we get HTML responses
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
        }
    })
    .then(response => {
        let contentType = response.headers['content-type'];

        // Hold on to the HTTP Headers
        results.headers = response.headers;
        // Hold on to the actual URL after all redirects
        results.realUrl = response.request.uri.href;

        // We did not recieve enough information from the request
        if (!contentType) {
            resolve(results);
            return;
        }

        // We have valid HTML
        if (_.includes(contentType, 'text/html')) {
            return xray(response.body, 'title')((err, title) => {
                if (err || !title) {
                    // Something actually went wrong
                    if (err) logger.error('Error in XRAY URL Chain', {
                        err
                    });
                    resolve(results);
                    return;
                }
                results.title = helpers.StripNewLine(_.trim(title));
                resolve(results);
                return;
            });
        }

        // We do not have valid HTML
        results.title = `${contentType.toUpperCase()} Document`;
        resolve(results);
    })
    .catch(err => {
        logger.error('Error in URL Get Document function', {
            err
        });
        results.unreachable = true;
        resolve(results);
    })
);
