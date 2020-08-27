const store = require( './store' )

class WebpackMediaQuerySplitPlugin {
    constructor( options ) {
        this.options = Object.assign({
            // filename: '[name]-[query].css', // todo
            queries: {}
        }, options)
    }

    apply( compiler ) {
        // save options in store to provide to loader
        store.options = this.options
    }
}

module.exports = WebpackMediaQuerySplitPlugin