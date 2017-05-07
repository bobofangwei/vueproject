const Music=require('./music');

var music1 = Object.create(Music);
music1.init(1, '但愿人长久', '王菲', 261, '但愿人长久.mp3', '', '但愿人长久.lrc');
var music2 = Object.create(Music);
music2.init(2, '独角戏', '许茹芸', 277, '独角戏.mp3', '', '独角戏.lrc');
var music3 = Object.create(Music);
music3.init(3, '如果云知道', '许茹芸', 330, '如果云知道.mp3', '', '如果云知道.lrc');



var musicStorage = {
    data: [music1, music2, music3],
    getAll: function() {
        return this.data;
    },
    getById: function(id) {
        let ret = this.data.find((item) => {
            return item.id === id;
        });
        //console.log('ret', ret);
        return ret;
    },
    deleteById: function(id) {
        var index = this.data.indexOf(this.getById(id));
        this.data.splice(index, 1);
    },
    delete: function(music) {
        this.data.splice(this.data.indexOf(music), 1);
    },
    save: function(music) {
        this.data.indexOf(music) <= -1 && this.data.push(music);
    }


};

module.exports = musicStorage;