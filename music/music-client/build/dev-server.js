require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var musics = require('../music.json')
var path = require('path');


// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port

// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)


/***my own code**/
const staticPath = path.join(__dirname, 'public');
// console.log('staticPath', staticPath);
app.use(express.static(staticPath));
var apiRouter = express.Router();
apiRouter.get('/music', (req, res) => {
    let result = [];
    musics.forEach((item) => {
        let tmp = {};
        Object.assign(tmp, item);
        tmp.music = uri + '/' + item.music;
        tmp.poster = uri + '/' + item.poster;
        tmp.lyric = uri + '/' + item.lyric;
        result.push(tmp);
    });
    res.json(result);
});
apiRouter.get('/music/:id', (req, res) => {
    let id = Number.parseInt(req.params.id, 10);
    if (!id) {
        res.send('数据不存在');
        return;
    }
    let temp = musics.find((item) => {
        return item.id === id;
    });
    if (!temp) {
        res.send('数据不存在');
        return;
    }
    let result = Object.assign({}, temp);
    result.music = uri + '/' + temp.music;
    result.poster = uri + '/' + temp.poster;
    result.lyric = uri + '/' + temp.lyric;
    res.json(result);
});
app.use('/api', apiRouter);
/**end my code**/

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: () => {}
    })
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
    var options = proxyTable[context]
    if (typeof options === 'string') {
        options = { target: options }
    }
    app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
    _resolve()
})

var server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}
