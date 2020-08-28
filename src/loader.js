const { root, parse } = require( 'postcss' )
const path = require( 'path' )
const parseQueries = require( './parseQueries' )
const testMedia = require( './testMedia' )
const store = require( './store' )

function recursiveIssuer(module)  {
    if (module.issuer) {
        return recursiveIssuer( module.issuer )
    }
    return module
}

module.exports = function loader(source, map, meta) {
    const { queries, filename } = store.options

    // todo: save in chunk / mby push new modules
    const thisModules = [ ...store.compilation._buildingModules.keys() ].filter( ({resource}) => resource === this.resource )
    if ( ! (Array.isArray( thisModules ) && thisModules.length) ) return source // ???
    
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

    let { resource } = recursiveIssuer( thisModules[0] )
    const name = path.basename( resource, path.extname( resource ) )

    Object.entries( roots ).forEach( ([query, root]) => {
        this.emitFile(
            filename.replace('[name]', name).replace('[query]', query),
            root.toString()
        )
    } )

    return thisRoot.toString()
}