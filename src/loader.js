const { root, parse } = require( 'postcss' )
const parseQueries = require( './parseQueries' )
const testMedia = require( './testMedia' )
const store = require( './store' )

module.exports = function loader(source, map, meta) {
    const { queries } = store.options
    
    const roots = Object.fromEntries( Object.keys( queries ).map( (query) => ([query, root()]) ) )
    const thisRoot = parse( source ) // i could use meta.ast.root here

    // todo: save parsed queries to store
    const matchMedia = testMedia( parseQueries(queries) )

    // removes any matching media from thisRoot and saves to other roots
    thisRoot.walkAtRules( 'media', (rule) => {
        const query = matchMedia( rule.params )
        if ( query ) {
            roots[ query ].append( rule.remove() )
        }
    } )

    Object.entries( roots ).forEach( ([query, root]) => {
        this.emitFile(
            'style-' + query + '.css', // todo: add entry name
            root.toString()
        )
    } )

    return thisRoot.toString()
}
// todo: read more about pitching
// module.exports.pitch = function pitch() {
// }