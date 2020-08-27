/**
 * @typedef {Object} Query
 * @property {String} query
 * @property {RegExp} pattern
 */

/**
 * @typedef {Object} QueriesOption
 * @property {RegExp|RegExp[]} [queryName]
 */

/**
 * Parses queries option object into flat list
 * @param {Object} queries
 * @returns {Query[]}
 */
const parseQueries = ( /** @type {QueriesOption} */ queries = {}) => Object.entries( queries ).map( ([query, pattern]) => {
    if ( Array.isArray( pattern ) ) return pattern.map( (pattern) => ({query, pattern}) )
    return {query, pattern}
} ).flat()

module.exports = parseQueries