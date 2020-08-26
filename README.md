# webpack-media-query-split-plugin

Executed right before emitting assets to output dir.

Requires node.js^12.0.0, webpack 4


```
// webpack.config.js

const WebpackMediaQuerySplitPlugin = require('@gunarssimkuns/webpack-media-query-split-plugin')

module.exports = {
  plugins: [
    new WebpackMediaQuerySplitPlugin({
      queries: {
				mobile: /\(max-width:767px\)/,
				tablet: [/\(min-width:768px\)/]
			},
			common: 'common', // query name for all styles that do not match query
			filename: '[name]-[query].css'
    })
  ]
}
```
