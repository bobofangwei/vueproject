/*提供api接口，供客户端调用*/
const express = require('express');
const musicStorage = require('../models/music.js');
const router = express.Router();
router.prefix = '/api';



/**
 * Get api:/api/music
 * 获取所有音乐的接口
 */
router.get('/music', (req, res) => {
    let allMusic = musicStorage.getAll();
    // console.log('allMusic', allMusic);
    res.json(allMusic.map((item) => {
        let temp = {};
        Object.assign(temp, item);
        temp.music = req.app.get('url') + '/music/' + item.music;
        temp.lyric = req.app.get('url') + '/music/' + item.lyric;
        temp.poster = req.app.get('url') + '/music/' + item.poster;
        return temp;
    }));
});
router.get('/music/:id', (req, res) => {
    let id = Number.parseInt(req.params.id, 10);
    //console.log('id', id);
    let curMusic = musicStorage.getById(id);
    if (!curMusic) {
        res.status(404).send('所请求的数据不存在');
        return;
    }
    let temp = {};
    Object.assign(temp, curMusic);
    temp.music = req.app.get('url') + '/music/' + curMusic.music;
    temp.lyric = req.app.get('url') + '/music/' + curMusic.lyric;
    temp.poster = req.app.get('url') + '/music/' + curMusic.poster;
    res.json(temp);
});

module.exports = router;
