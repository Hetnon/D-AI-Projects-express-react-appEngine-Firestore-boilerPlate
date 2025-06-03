module.exports = function(api) {
    api.cache(true);

    const presets = [
        ["@babel/preset-env", {
          "targets": {
            "node": "current"
          },
          "modules": "commonjs"
        }],
        "@babel/preset-react"
    ];

    const plugins = [
        '@babel/plugin-transform-modules-commonjs',
        ["module-resolver", {
            "root": ["./"],
            "alias": {
              "@classes": "../ClassDefinitions/"
            }
        }]
    ];

    return { presets, plugins };
};
