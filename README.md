# webpack-media-query-split-plugin

Executed right before emitting assets to output dir.

Requires node.js^12.0.0, webpack 4


```javascript
// webpack.config.js
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const WebpackMediaQuerySplitPlugin = require( '@gunarssimkuns/webpack-media-query-split-plugin' )

module.exports = {
	module: {
		rules: [
			{
				test: /\.s?[ac]ss$/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: 'css-loader' },
					{ loader: WebpackMediaQuerySplitPlugin.loader },
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' },
				]
			},
        ]
    },
    plugins: [
        new WebpackMediaQuerySplitPlugin({
            queries: {
                mobile: /\(max-width: 767px\)/,
                tablet: [ /\(min-width: 768px\)/ ]
            },
            filename: '[name]-[query].css'
        })
    ]
}
```
