/*针对音乐文件的增删改查操作*/
const express = require('express');
const musicStorage = require('../models/musicstorage');
const pageRouter = express.Router();
const formidable = require('formidable');
const path = require('path');
const Music = require('../models/music');

pageRouter.prefix = '/music';

pageRouter.get('/list', (req, res) => {
    //console.log('get list');
    res.locals.title = '歌曲列表';
    res.locals.list = musicStorage.getAll();

    res.render('list');
});
pageRouter.get('/add', (req, res) => {
    res.locals.title = '增加新音乐';
    res.render('add');
})
pageRouter.post('/add', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../asserts/music/');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err;
        }
        var id = 0;
        //找出现有的最大的id
        var list = musicStorage.getAll();
        list.forEach((item) => {
            if (item.id > id) {
                id = item.id;
            }
        });
        var name = fields.name;
        var artist = fields.artist;
        var duration = fields.duration;
        var musicPath = path.basename(files.music.path);
        var posterPath = path.basename(files.poster.path);
        var lyricPath = path.basename(files.lyric.path);
        var music = Object.create(Music);
        music.init(++id, name, artist, duration, musicPath, posterPath, lyricPath);
        musicStorage.save(music);
        res.redirect('/music/list');
    });
});
pageRouter.get('/edit/:id', (req, res) => {
    var id = Number.parseInt(req.params.id, 10);
    if (!id) {
        return res.status('404').send('没有该记录');
    }
    var music = musicStorage.getById(id);
    if (!music) {
        return res.status('404').send('没有该记录');
    }
    res.locals.music = music;
    res.render('edit');
});
pageRouter.post('/edit/:id', (req, res) => {
    var id = Number.parseInt(req.params.id, 10);
    if (!id) {
        return res.status('404').send('没有该记录');
    }
    var music = musicStorage.getById(id);
    //console.log('music', music);
    if (!music) {
        return res.status('404').send('没有该记录');
    }
    console.log('req.body', req.body);
    music.name = req.body.name;
    music.artist = req.body.artist;

    res.redirect('/music/list');
});

pageRouter.get('/delete/:id', (req, res) => {
    var id = Number.parseInt(req.params.id);
    if (!id) {
        res.status('404').send('没有该条记录');
    }
    musicStorage.deleteById(id);
    res.redirect('/music/list');
});

module.exports = pageRouter;
