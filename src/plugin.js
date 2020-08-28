const pluginName = 'WebpackMediaQuerySplitPlugin'
const store = require( './store' )
const { plugin } = require('@gunarssimkuns/webpack-media-query-split-plugin/node_modules/postcss')
const { compilation } = require('webpack')

const MODULE_TYPE = 'css/' + pluginName

class WebpackMediaQuerySplitPlugin {
    constructor( options ) {
        this.options = Object.assign({
            filename: '[name]-[query].css',
            queries: {}
        }, options)
    }

    apply( compiler ) {
        // save options in store to provide to loader
        store.options = this.options

        compiler.hooks.thisCompilation.tap( pluginName, (compilation) => {
            /**
             * compilation buildModule lifecycle hook will trigger out loader 
             * and we can provide webpack Compilation object
             * 
             * Module will not be built yet but we can modify its source there
             */
            store.compilation = compilation
        } )
    }
}

module.exports = WebpackMediaQuerySplitPlugin