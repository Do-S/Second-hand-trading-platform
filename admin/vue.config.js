module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: {
            '/web': {
                target: 'https://restapi.amap.com/v3',  // target host
                ws: true,  // proxy websockets
                secure: true,
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/web': ''  // rewrite path
                }
            },
            '/api': {
                target: 'http://localhost:3000',  // target host
                ws: true,  // proxy websockets
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': ''  // rewrite path
                }
            }
        },
    },
};