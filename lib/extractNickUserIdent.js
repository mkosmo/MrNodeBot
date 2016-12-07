'use strict';
// Pattern to base extract on
const pattern = /^([^\s\*\@]+)?\*?([^\s@]+)?@?([^\s]+)?$/im;
const _ = require('lodash');
module.exports = text => {
    // Invalid args
    if (!text) return Object.create(null);
    let matches = text.match(pattern);

    // No matches available, return empty object
    if (!matches || _.isEmpty(matches[0])) return Object.create(null);

    return {
        fullMatch: matches[0],
        nick: matches[1],
        user: matches[2],
        host: matches[3]
    };
};