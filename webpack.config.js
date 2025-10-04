const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};

// const webpack = require('@nativescript/webpack')

// module.exports = (env) => {
//   webpack.init(env)
//   webpack.Utils.addCopyRule('**/*.md')
//   webpack.Utils.addCopyRule({
//     from: '@nativescript/webpack/stubs',
//     to: 'custom/location',
//     context: webpack.Utils.project.getProjectFilePath('node_modules'),
//   })
//   return webpack.resolveConfig()
// }