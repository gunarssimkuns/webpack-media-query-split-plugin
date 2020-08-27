/**
 * @typedef {Object} Query
 * @property {String} query
 * @property {RegExp} pattern
 */

/**
 * Returns query name if pattern matches media, otherwise returns false
 */
const testMedia = /** @param {Query[]} queries */ (queries) => /** @param {String} media */ (media) => {
    let i = queries.length
    while ( i-- ) {
        if ( queries[i].pattern.test( media ) ) return queries[i].query
    }
    return false
}

module.exports = testMedia