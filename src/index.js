const pluginName = 'WebpackMediaQuerySplitPlugin'
const css = require( 'css' )
const CleanCSS = require( 'clean-css' )
const { RawSource } = require( 'webpack-sources' )

const log = function () {
    console.log( pluginName, arguments[0] )
}

/** @typedef {import("webpack-sources").RawSource} RawSource */
/** @typedef {import("webpack-sources").Source} Source */

/**
 * @typedef {Object} AssetInfo
 * @property {boolean=} immutable true, if the asset can be long term cached forever (contains a hash)
 * @property {number=} size size in bytes, only set after asset has been emitted
 * @property {boolean=} development true, when asset is only used for development and doesn't count towards user-facing assets
 * @property {boolean=} hotModuleReplacement true, when asset ships data for updating an existing application (HMR)
 */

/**
 * @typedef {Object} Asset
 * @property {string} name the filename of the asset
 * @property {Source} source source of the asset
 * @property {AssetInfo} info info about the asset
 */

/**
 * @typedef {Object} Query
 * @property {String} query
 * @property {RegExp} pattern
 */

/**
 * Parses queries option object
 * @param {Object} queries
 * @returns {Query[]}
 */
const parseQueries = (queries = {}) => Object.entries( queries ).map( ([query, pattern]) => {
    if ( Array.isArray( pattern ) ) return pattern.map( (pattern) => ({query, pattern}) )
    return {query, pattern}
} ).flat()

/**
 * Tells which query media belongs to
 */
const testMedia = /** @param {Query[]} queries */ (queries) => /** @param {String} media */ (media) => {
    let i = queries.length
    while ( i-- ) {
        if ( queries[i].pattern.test( media ) ) return queries[i].query
    }
    return false
}

const apply = ({ compiler, options }) => {
    const { filename, queries, common } = options

    const matchMedia = testMedia( parseQueries(queries) )

    compiler.hooks.emit.tapAsync( pluginName, ( compilation, callback ) => {

        /** @type {Asset[]} */
        const assets = compilation.getAssets(),
            cssAssets = assets.filter( ( /** @param {Asset} asset */ asset ) => /\.css$/.test( asset.name ) )

        
        cssAssets.forEach( ( cssAsset ) => {
            const output = Object.fromEntries( [ common, ...Object.keys( queries ) ].map( (query) => ([query, []]) ) )

            const ast = css.parse( cssAsset.source.source() ),
                { rules } = ast.stylesheet

            rules.forEach( (rule) => {
                if ( rule.type === 'media' ) {
                    // todo: memoize matchMedia
                    const query = matchMedia( rule.media )
                    if (query) return output[ query ].push( rule )
                }
                return output[ common ].push( rule )
            } )

            Object.entries( output ).forEach( ([ query, rules ]) => {
                // todo: minify source
                let source = css.stringify( {
                    type: 'stylesheet',
                    stylesheet: { rules }
                } )

                source = new CleanCSS().minify( source ).styles

                let name = filename.replace(/\[(.*?)\]/g, (match) => {
                    const key = match.slice(1, -1)
                    if (key === 'name') return cssAsset.name.split('.')[0]
                    if (key === 'query') return query
                    return match
                } )

                /** @type {Asset} */
                const asset = {
                    name,
                    source: new RawSource( Buffer.from( source ) )
                }
                compilation.emitAsset( asset.name, asset.source )
            } )
        } )
        
        callback()
    } )
}

class WebpackMediaQuerySplitPlugin {
    constructor( options ) {
        this.options = Object.assign({
            filename: '[name]-[query].css',
            common: 'common',
            queries: {}
        }, options)
    }

    apply( compiler ) {
        const { queries, common, filename } = this.options

        apply({
            compiler,
            options: {
                filename,
                common,
                queries
            }
        })
    }
}

module.exports = WebpackMediaQuerySplitPlugin
module.exports.default = WebpackMediaQuerySplitPlugin
// todo: implement loader