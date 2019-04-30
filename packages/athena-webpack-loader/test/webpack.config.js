module.exports = {
    module: {
        rules: [
            {
                test: /\.lua/,
                use: [
                    '@aergo/athena-webpack-loader',
                ]
            }
        ]
    }
};