const path = require('path');
const express = require('express');
const bodyParser=require('body-parser');
const apiRouter = require('./controllers/api.js');
const pageRouter=require('./controllers/music.js');

const app = express();

//设置模板渲染
app.set('views','./views');
app.set('view engine','xtpl');

app.set('port', process.env.PORT || 9000);
app.use(express.static(path.join(__dirname, 'asserts')));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiRouter.prefix, apiRouter);
app.use(pageRouter.prefix,pageRouter);

 

if (!module.parent) {
    app.listen(app.get('port'), (err) => {
        if (err) {
            throw (err);
            return;
        }
        app.set('url', 'http://127.0.0.1:' + app.get('port'));
        console.log('server listen at ' + app.get('url'));
    });
}
       
module.exports = app;
